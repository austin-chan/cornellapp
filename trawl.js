/**
 * @fileoverview Performs the operation of retrieving, storing and updating
 * all course data from the Cornell University Courses API. This file is named
 * after the Google web crawler's internal name "Trawler". Run trawl in the
 * command line with an argument of the semester name to update:
 * 'node trawl FA15'
 */

var async = require('async'),
	_ = require('underscore'),
	chalk = require('chalk'),
	config = require('config'),
	knex = require('knex')(config.knex),
	bookshelf = require('bookshelf')(knex),
	models = require('./app/models')(bookshelf),
	cornellutil = require('./app/utils/cornellutil'),
	courseutil = require('./app/utils/courseutil')(models, knex),
	semester = process.argv[2];

if (!semester || typeof semester != 'string') {
	console.log('Provide a semester to scrape as an argument.');
	process.exit(1);
}

semester = semester.toUpperCase();

async.waterfall([
	// check that semester argument is available
	function(callback) {
		cornellutil.getRoster(semester, function(roster) {
			if (!roster) {
				callback(semester + ' is not an available semester');
				return;
			}

			printSuccess('Verified semester ' + semester + ' is available');
			callback(null, roster);
		});
	},

	// fetch an already saved semester entry or save a new semester entry
	function(roster, callback) {
		new models.semester({
			slug: semester
		}).fetch().then(function(semesterEntry) {
			// semester entry already exists
			if (semesterEntry) {
				callback(null, semesterEntry);

			// save new semester entry
			} else {
				new models.semester({
					descr: roster.descr,
					lastModifiedDttm: roster.lastModifiedDttm,
					slug: roster.slug,
					strm: roster.strm
				}).save().then(function(semesterEntry) {
					printSuccess('Inserted semester entry');
					callback(null, semesterEntry);
				});
			}
		});
	},

	// get all subjects for semester
	function(semesterEntry, callback) {
		cornellutil.getSubjects(semester, function(subjects) {
			if (!subjects || !subjects.length) {
				callback(semester + ' is not an available semester.');
				return;
			}

			printSuccess('Retrieved list of available subjects');
			callback(null, semesterEntry, subjects);
		});
	},

	// get courses for all subjects
	function(semesterEntry, subjects, callback) {
		// TODO: remove this after testing
		subjects = subjects.slice(0,2);

		console.log('Retrieving all courses for semester ' + semester + '...');

		async.map(subjects, function(subject, callback) {
			cornellutil.getCourses(semester, subject, function(coursesData) {
				if (!coursesData) {
					callback(subject);
					return;
				}

				printSuccess('    Retrieved ' + subject + ' courses');
				callback(null, coursesData);
			});
		}, function(err, subjectCoursesData) {
			if (err) {
				callback('An error occurred retrieving courses for subject ' +
					err);
				return;
			}

			var courses = _.flatten(subjectCoursesData, true);

			printSuccess('Retrieved ' + courses.length + ' courses to sync ' +
			'with the database');
			callback(null, semesterEntry, courses);
		});
	},

	// fetch all course entries for the semester
	function(semesterEntry, courses, callback) {
		new models.course({
			strm: semesterEntry.get('strm')
		}).fetchAll({
			withRelated: ['groups.sections.meetings']
		}).then(function(courseEntries) {
			printSuccess('Fetched already saved courses for semester '
				+ semester);
			callback(null, courses, courseEntries);
		});
	},

	// analyze the courses against the course entries
	function(courses, courseEntries, callback) {
		var pairsToUpdate = [] // course API object and course entry tuples

		while (courseEntries.length && courses.length) {
			var course = courses[0],
				courseEntry = courseEntries.findWhere({
					crseId: course.crseId
				});

			if (courseEntry) {
				if (!courseutil.isIdenticalCourse(course, courseEntry)) {
					pairsToUpdate.push([course, courseEntry]);
				}

				courseEntries.remove(courseEntry);
				courses.shift();
			}
		}

		callback(null, courses, courseEntries, pairsToUpdate);
	},

	// update existing course entries
	function(courses, courseEntries, pairsToUpdate, callback) {
		async.each(pairsToUpdate, function(pairToUpdate, callback) {
			var course = pairToUpdate[0],
				courseEntry = pairToUpdate[1];

			courseutil.updateCourse(course, courseEntry, function(err) {
				if (err) {
					callback(err);
					return;
				}

				callback();
			});
		}, function(err) {
			if (err) {
				callback('An error occurred during updating of a course entry' +
					err);
				return;
			}

			callback(null, courses, courseEntries);
		});
	},

	// delete courses in the database that don't match the Courses API
	function(courses, courseEntries, callback) {
		if (!courseEntries.length) {
			callback(null, courses);
			return;
		}

		async.each(courseEntries, courseutil.deleteCourse, function(err) {
			if (err) {
				callback('An error occurred deleting course entries in the ' +
					'database while ' + err);
			}

			callback(null);
		});
	},

	// insert all courses not already in the database
	function(courses, callback) {
		if (!courses.length) {
			callback(null);
			return;
		}

		async.each(courses, courseutil.insertCourse, function(err) {
			if (err) {
				callback('An error occurred saving new courses to the ' + 
					'database while ' + err);
			}

			callback(null);
		});
	}

], function(err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log('here');
	}

	process.exit(1);
});

function printSuccess(message) {
	console.log(message + '. ' + chalk.green('Success \u2713'));
}

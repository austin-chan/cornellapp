/**
 * @fileoverview Performs the operation of retrieving, storing and updating
 * all course data from the Cornell University Courses API. This file is named
 * after the Google web crawler's internal name "Trawler". Run trawl in the
 * command line with an argument of the semester name to update:
 * 'node trawl FA15'
 */

var async = require('async'),
	_ = require('underscore'),
	config = require('config'),
	knex = require('knex')(config.knex),
	bookshelf = require('bookshelf')(knex),
	models = require('./app/models')(bookshelf),
	cornellutil = require('./app/utils/cornellutil'),
	courseutil = require('./app/utils/courseutil')(knex, models),
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
				callback(semester + ' is not an available semester.');
				return;
			}

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

			callback(null, semesterEntry, subjects);
		});
	},

	// get courses for all subjects
	function(semesterEntry, subjects, callback) {
		// TODO: remove this after testing
		subjects = subjects.slice(0,2);

		async.map(subjects, function(subject, callback) {
			cornellutil.getCourses(semester, subject, function(coursesData) {
				if (!coursesData) {
					callback(subject);
					return;
				}

				console.log('Fetched ' + subject + ' courses.');
				callback(null, coursesData);
			});
		}, function(err, subjectCoursesData) {
			if (err) {
				callback('An error occurred retrieving courses for subject ' +
					err);
				return;
			}

			callback(null, semesterEntry, subjectCoursesData);
		});
	},

	// fetch all course entries for the semester
	function(semesterEntry, subjectCoursesData, callback) {
		new models.course({
			strm: semesterEntry.get('strm')
		}).fetchAll().then(function(courseEntries) {
			callback(null, semesterEntry, subjectCoursesData, courseEntries);
		});
	},

	// update or save all classes
	function(semesterEntry, subjectCoursesData, courseEntries, callback) {
		var courses = _.flatten(subjectCoursesData, true);

		console.log('Retrieved ' + courses.length + ' courses to sync with ' +
			'the database.');
		courseutil.saveCourses(courses, function(err) {
			if (err) {
				callback('An error occurred saving new courses to the ' + 
					'database while ' + err);
			}

			callback(null);
		});
		// async.each(courses, callback);
		// async.each(courses, function(course, callback) {
		// 	courseutil.saveCourse(course, callback);
		// }, function(err) {
		// 	if (err) {
		// 		callback('An error occurred saving new courses to the ' + 
		// 			'database while ' + err);
		// 	}

		// 	callback(null);
		// });
	}

], function(err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log('Completed database sync for semester ' + semester + '.');
	}

	process.exit(1);
});

/**
 * @fileoverview Module to perform instructions related to managing course data
 * and handling database entries 
 */

module.exports = function(models, knex) {
	var async = require('async'),
		_ = require('underscore'),
		professorMemo = [],
		m = {};

	/**
	 * Compares a course object from the Cornell Courses API against an existing
	 * course entry in the database. This function assumes that the course
	 * entry model instance has preloaded its respective
	 * groups.sections.meetings.professors relations.
	 * @param {object} course Object representing a course from the Cornell
	 *     Courses API to compare with.
	 * @param {object} courseEntry Course model instance of a course entry to
	 *     compare with.
	 * @return {boolean} Return true if the two representations of courses are
	 *     identical and the course entry does not need to be updated
	 */
	m.isIdenticalCourse = function(course, courseEntry) {
		var copyCourse = JSON.parse(JSON.stringify(course)),
			copyCourseEntry = courseEntry.toJSON();

		// delete ids and relation ids for the entry
		delete copyCourseEntry['id'];
		for (var i = 0; i < copyCourseEntry.groups.length; i++) {
			var group = copyCourseEntry.groups[i];
			delete group['id'];
			delete group['courseId'];

			for(var j = 0; j < group.sections.length; j++) {
				var section = group.sections[j];
				section.isComponentGraded = !!section.isComponentGraded;
				delete section['id'];
				delete section['groupId'];

				for(var k = 0; k < section.meetings.length; k++) {
					var meeting = section.meetings[k];
					delete meeting['id'];
					delete meeting['sectionId'];

					for(var l = 0; l < meeting.professors.length; l++) {
						var professor = meeting.professors[l];
						delete professor['_pivot_professorNetid'];
						delete professor['_pivot_meetingId'];
					}
				}
			}
		}

		// sanitize course API object
		sanitizeCourseObject(copyCourse);
		copyCourse.groups = copyCourse.enrollGroups;
		delete copyCourse['enrollGroups'];
		for (var i = 0; i < copyCourse.groups.length; i++) {
			var group = copyCourse.groups[i];
			sanitizeGroupObject(group);

			group.sections = group.classSections;
			delete group['classSections'];

			for(var j = 0; j < group.sections.length; j++) {
				var section = group.sections[j];
				sanitizeSectionObject(section);

				for(var k = 0; k < section.meetings.length; k++) {
					var meeting = section.meetings[k];

					meeting.professors = meeting.instructors;
					delete meeting['instructors'];

					for(var l = 0; l < meeting.professors.length; l++) {
						var professor = meeting.professors[l];
						sanitizeProfessorObject(professor);
					}
				}
			}
		}

		// delete copyCourse.groups[0].sections[0].meetings[0]['professors'];
		// delete copyCourseEntry.groups[0].sections[0].meetings[0]['professors'];

		// if (!_.isEqual(copyCourseEntry, copyCourse)) {
		// 	// console.log(_.isEqual(copyCourseEntry, copyCourse));
		// 	// console.log(copyCourseEntry);
		// 	// console.log(copyCourse);
		// 	// console.log(_.isEqual(copyCourseEntry.groups[25], copyCourse.groups[25]));
		// 	// console.log(_.isEqual(copyCourseEntry.groups[26], copyCourse.groups[26]));

		// 	console.log(_.isEqual(copyCourseEntry, copyCourse));
		// 	console.log(copyCourseEntry.groups[0].sections);
		// 	console.log(copyCourse.groups[0].sections);
		// 	// console.log(copyCourse.subject + ' ' + copyCourse.catalogNbr);

		// 	// _.each(copyCourse.groups, function(el) {
		// 	// 	console.log(el.sections[0].section);
		// 	// });
		// 	// _.each(copyCourseEntry.groups, function(el) {
		// 	// 	console.log(el.sections[0].section);
		// 	// });
		// 	process.exit(1);
		// }

		return _.isEqual(copyCourseEntry, copyCourse);
	}

	/**
	 * Update a course entry in the database to reflect the values in a course
	 * object from the Cornell Courses API. The update cascades down to the
	 * course entry's corresponding groups.sections.meetings.professors 
	 * relations.
	 * @param {object} course Object representing a course from the Cornell
	 *     Courses API to copy values from.
	 * @param {object} courseEntry Course model instance of a course entry to
	 *     update.
	 * @param {function} callback Callback function to call when the operation
	 *     is finished. Callback is called with no parameters if the update was
	 *     successful or with an error message as the first parameter if an
	 *     error occurs.
	 */
	m.updateCourse = function(course, courseEntry, callback) {
		callback();
	}

	/**
	 * Delete a course entry from the database and cascade the delete down to
	 * all of its groups.sections.meetings.professors relation objects.
	 * @param {object} courseEntry Course model instance of a course entry to
	 *     delete.
	 * @param {function} callback Callback function to call when the operation
	 *     is finished. Callback is called with no parameters if the delete was
	 *     successful or with an error message as the first parameter if an
	 *     error occurs.
	 */
	m.deleteCourse = function(courseEntry, callback) {
		callback();
	}

	/**
	 * Save a course into the database as a new entry. Create the new entry from
	 * a course object taken from the Cornell Courses API. This function also
	 * saves the corresponding groups.sections.meetings.professors relations
	 * data as new entries in the database.
	 * @param {string} course Object taken from the Cornell Courses API.
	 * @param {function} callback Callback function that is run when the
	 *     operation is finished. No argument is passed if successful and a
	 *     non-empty string is passed otherwise.
	 */
	m.insertCourse = function(course, callback) {
		var enrollGroups = extractProperty(course, 'enrollGroups');
		sanitizeCourseObject(course);

		async.waterfall([
			// save course object
			function(callback) {
				new models.course(course).save().then(function(savedCourse) {
					callback(null, savedCourse);
				}).catch(function(err) {
					callback('creating course entries.');
				});
			},

			// cascade down to enrollGroups
			function(savedCourse, callback) {
				async.mapSeries(enrollGroups, function(group, callback) {
					sanitizeGroupObject(group);
					group.courseId = savedCourse.get('id');

					var classSections = 
						extractProperty(group, 'classSections');

					new models.group(group).save().then(function(savedGroup) {
						callback(null, [savedGroup, classSections]);

					}).catch(function(err) {
						callback('creating enroll group entries.');
					});

				}, function(err, groupSections) {
					if (err) {
						callback(err);
						return;
					}

					callback(null, groupSections);
				});
			},

			// cascade down to classSections.
			function(groupSections, callback) {
				async.mapSeries(groupSections, function(groupSection, callback) {

					var savedGroup = groupSection[0],
						sections = groupSection[1];

					async.mapSeries(sections, function(section, callback) {
						section.groupId = savedGroup.get('id');
						sanitizeSectionObject(section);

						var meetings = extractProperty(section, 'meetings');

						new models.section(section).save().then(
							function(savedSection) {

							callback(null, [savedSection, meetings]);
						}).catch(function(err) {
							callback('creating class section entries.');
						});
					}, function(err, sectionMeetings) {
						if (err) {
							callback(err);
							return;
						}

						callback(null, sectionMeetings);
					});
				}, function(err, sectionMeetings) {
					if (err) {
						callback(err);
						return;
					}

					// flatten the enrollGroup level
					sectionMeetings = _.flatten(sectionMeetings, true);
					callback(null, sectionMeetings);
				});
			},

			// cascade down to meetings
			function(sectionMeetings, callback) {
				async.mapSeries(sectionMeetings, function(sectionMeeting, callback) {

					var savedSection = sectionMeeting[0],
						meetings = sectionMeeting[1];

					async.mapSeries(meetings, function(meeting, callback) {
						meeting.sectionId = savedSection.get('id');

						var professors =
							extractProperty(meeting, 'instructors');

						new models.meeting(meeting).save().then(
							function(savedMeeting) {

							callback(null, [savedMeeting, professors]);
						}).catch(function(err) {
							callback('creating meeting entries.');
						});
					}, function(err, meetingProfessors) {
						if (err) {
							callback(err);
							return;
						}

						callback(null, meetingProfessors);
					});
				}, function(err, meetingProfessors) {
					if (err) {
						callback(err);
						return;
					}

					// flatten the meetings level
					meetingProfessors = _.flatten(meetingProfessors, true);
					callback(null, meetingProfessors);
				});
			},

			// cascade down to professors - make sure a professor entry exists
			// and create meeting_professors_joins table entries
			function(meetingProfessors, callback) {
				async.eachSeries(meetingProfessors,
					function(meetingProfessor, callback) {

					var meeting = meetingProfessor[0],
						professors = meetingProfessor[1];

					if (!professors.length) {
						callback(null);
						return;
					}

					async.parallel([
						function(callback) {
							async.eachSeries(professors, createProfessorEntry,
								function(err) {

								if (err) {
									callback('creating professor entries.');
									return;
								}

								callback();
							});
						},
						function(callback) {
							async.eachSeries(professors, 
								function(professor, callback) {

								knex('meeting_professors_joins').insert({
									meetingId: meeting.id,
									professorNetid: professor.netid
								}).then(function() {
									callback();
								}).catch(function(err) {
									callback('creating ' + 
										'meeting_professors_joins entries');
								});
							}, function(err) {
								if (err) {
									callback(err);
									return;
								}

								callback(null);
							});
						}
					], function(err) {
						if (err) {
							callback(err);
							return;
						}

						callback(null);
					});
				}, function(err) {
					if (err) {
						callback(err);
						return;
					}

					callback(null);
				});
			}
		], function(err) {
			if (err) {
				callback(err);
				return;
			}

			callback();
		});
	}

	/**
	 * Create a professor entry in the database if it does not exist already.
	 * This function is optimized with memoization using the professorMemo array
	 * initialized at the top of this module.
	 * @param {object} professor Professor object from the Cornell Courses API
	 *     to create a professor entry from.
	 * @param {function} callback Callback function that is run when the
	 *     operation is finished. No argument is passed if successful and a
	 *     non-empty string is passed otherwise.
	 */
	function createProfessorEntry(professor, callback) {
		if (professorMemo.indexOf(professor.netid) != -1) {
			callback();
			return;
		}

		sanitizeProfessorObject(professor);

		new models.professor({
			netid: professor.netid
		}).fetch().then(function(savedProfessor) {
			if (savedProfessor) {
				professorMemo.push(professor.netid);
				callback();
				return;
			}

			new models.professor(professor).save().then(function() {
				professorMemo.push(professor.netid);
				callback();
			}).catch(function(err) {
				if (err.code == 'ER_DUP_ENTRY') {
					// this error is fine, redundant programming
					callback();
					return;
				}

				callback('creating professor entries.');
			});
		}).catch(function(err) {
			callback('creating professor entries.');
		});
	}

	/**
	 * Convenience function to json flatten a property of a course. If the
	 * property is an array, reset it as a json encoded version of the array. If
	 * the property is not an empty array or is null, reset it as a json encoded
	 * empty array.
	 * @param {object} course Course object to possibly flatten.
	 * @param {string} key Property key to possibly flatten.
	 */
	function jsonFlatten(course, key) {
		course[key] = !course[key] || !course[key].length ? '[]' :
			JSON.stringify(course[key]);
	}

	/**
	 * Convenience function to get the property value and delete the property
	 * from the course object. The preserved value is returned from this
	 * function.
	 * @param {object} course Course object to extract from.
	 * @param {string} key Property key to extract from.
	 */
	function extractProperty(course, key) {
		var value = course[key];
		delete course[key];
		return value;
	}

	/**
	 * Convenience function to fold classSection notes data from the object
	 * provided in the Cornell Courses API into a plain array of strings.
	 * @param {object} notes Object of notes provided by the Cornell Courses
	 *     API.
	 * @return {array} Array of strings for each element in the original notes
	 *     array.
	 */
	function reduceNotes(section) {
		section.notes = _.map(section.notes, function(note) {
			return note.descrlong;
		});
	}

	/**
	 * Convenience function to sanitize a course object from the Cornell Courses
	 * API to prepare it for insertion into the database.
	 * @param {object} course Course object to sanitize.
	 */
	function sanitizeCourseObject(course) {
		jsonFlatten(course, 'catalogOutcomes');
	}

	/**
	 * Convenience function to sanitize a group object from the Cornell Courses
	 * API to prepare it for insertion into the database.
	 * @param {object} group Group object to sanitize.
	 */
	function sanitizeGroupObject(group) {
		jsonFlatten(group, 'componentsOptional');
		jsonFlatten(group, 'componentsRequired');
		jsonFlatten(group, 'simpleCombinations');
	}

	/**
	 * Convenience function to sanitize a section object from the Cornell
	 * Courses API to prepare it for insertion into the database.
	 * @param {object} section Section object to sanitize.
	 */
	function sanitizeSectionObject(section) {
		reduceNotes(section);
		jsonFlatten(section, 'notes');
	}

	/**
	 * Convenience function to sanitize a professor object from the Cornell
	 * Courses API to prepare it for insertion into the database.
	 * @param {object} professor Professor object to sanitize.
	 */
	function sanitizeProfessorObject(professor) {
		delete professor['instrAssignSeq'];
	}

	return m;
}
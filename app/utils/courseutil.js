/**
 * @fileoverview Module to perform instructions related to managing course data
 * and handling database entries 
 */

module.exports = function(knex, models) {
	var async = require('async'),
		_ = require('underscore'),
		m = {};

	/**
	 * Save a course into the database as a new entry. Create the new entry from
	 * a course object taken from the Cornell Courses API.
	 * @param {string} course Object taken from the Cornell Courses API.
	 * @param {Function} callback Callback function that is run when the
	 *     operation is finished. No argument is passed if successful and a
	 *     non-empty string is passed otherwise.
	 */
	m.saveCourses = function(courses, callback) {
		async.waterfall([
			// save course objects
			function(callback) {
				var preparedCourses = _.map(courses, function(course) {
					jsonFlatten(course, 'catalogOutcomes');
					return course;
				});
				var courseSets = unflattenArray(preparedCourses, 512);

				async.map(courseSets, function(courseSet, callback) {
					var enrollGroups = _.map(courseSet, function(course) {
						return extractProperty(course, 'enrollGroups');
					});

					knex('courses').insert(courseSet, 'id').then(
						function(ids) {

						callback(null, [ids, enrollGroups]);

					}).catch(function(err) {
						console.log(err);
						callback('saving course entries.');
					});
				}, function(err, courseIdEnrollGroups) {
					if (err) {
						callback(err);
						return;
					}

					// console.log(courseIdEnrollGroups);

					var flattenedCourseIdEnrollGroups =
						_.flatten(courseIdEnrollGroups, true);

					var combinedCourseIdEnrollGroups =
						_.map(flattenedCourseIdEnrollGroups[0],
						function(el, i) {

						return [el, flattenedCourseIdEnrollGroups[i]];
					});
						console.log(combinedCourseIdEnrollGroups[0].length);
					callback(null, combinedCourseIdEnrollGroups);
				});
			},

			// cascade down to enrollGroups
			function(combinedCourseIdEnrollGroups, callback) {
				var courseIdEnrollGroups =
					expandArray(combinedCourseIdEnrollGroups);

					// console.log(combinedCourseIdEnrollGroups.length);
					// console.log(courseIdEnrollGroups.length);

				var enrollGroups = _.map(courseIdEnrollGroups,
					function(courseIdEnrollGroup) {

					var courseId = courseIdEnrollGroup[0],
						group = courseIdEnrollGroups[1];

					jsonFlatten(group, 'componentsOptional');
					jsonFlatten(group, 'componentsRequired');
					jsonFlatten(group, 'simpleCombinations');
					group.courseId = courseId;

					return group;
				});

				var enrollGroupSets = unflattenArray(enrollGroups, 512);

				async.map(enrollGroupSets, function(enrollGroupSet, callback) {
					var classSections = _.map(enrollGroupSet, function(course) {
						return extractProperty(course, 'classSection');
					});
					knex('groups').insert(enrollGroupSet, 'id').then(
						function(ids) {

						callback(null, [ids, classSections]);
					}).catch(function(err) {
						console.log(err);
						callback('saving course entries.');
					});

				}, function(err, results) {
					if (err) {
						callback(err);
						return;
					}

					callback(null, results);
				});
			},

			// // cascade down to classSections.
			// function(savedGroupSections, callback) {
			// 	async.map(savedGroupSections,
			// 		function(savedGroupSection, callback) {

			// 		var savedGroup = savedGroupSection[0],
			// 			sections = savedGroupSection[1];

			// 		async.map(sections, function(section, callback) {
			// 			section.groupId = savedGroup.get('id');
			// 			section.notes = reduceNotes(section.notes);
			// 			jsonFlatten(section, 'notes');

			// 			var meetings = extractProperty(section, 'meetings');

			// 			new models.section(section).save().then(
			// 				function(savedSection) {

			// 				callback(null, [savedSection, meetings]);
			// 			}).catch(function(err) {
			// 				callback('saving class sections.');
			// 			});
			// 		}, function(err, savedSectionMeetings) {
			// 			if (err) {
			// 				callback(err);
			// 				return;
			// 			}

			// 			callback(null, savedSectionMeetings);
			// 		});
			// 	}, function(err, savedSectionMeetings) {
			// 		if (err) {
			// 			callback(err);
			// 			return;
			// 		}

			// 		// flatten the enrollGroup level.
			// 		savedSectionMeetings =
			// 			_.flatten(savedSectionMeetings, true);
			// 		callback(null, savedSectionMeetings);
			// 	});
			// },

			// // cascade down to meetings
			// function(savedSectionMeetings, callback) {
			// 	async.map(savedSectionMeetings,
			// 		function(savedSectionMeeting, callback) {

			// 		var savedSection = savedSectionMeeting[0],
			// 			meetings = savedSectionMeeting[1];

			// 		async.map(meetings, function(meeting, callback) {
			// 			meeting.sectionId = savedSection.get('id');

			// 			var professors =
			// 				extractProperty(meeting, 'instructors');

			// 			new models.meeting(meeting).save().then(
			// 				function(savedMeeting) {

			// 				callback(null, [savedMeeting, professors]);
			// 			}).catch(function(err) {
			// 				callback('saving class sections.');
			// 			});
			// 		}, function(err, savedSectionMeetings) {
			// 			if (err) {
			// 				callback(err);
			// 				return;
			// 			}

			// 			callback(null, savedSectionMeetings);
			// 		});
			// 	}, function(err, savedMeetingProfessors) {
			// 		if (err) {
			// 			callback(err);
			// 			return;
			// 		}

			// 		callback(null, savedMeetingProfessors);
			// 	});
			// }

		], function(err, result) {
			if (err) {
				callback(err);
				return;
			}

			callback();
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
	 * from an object. The preserved value is returned.
	 * @param {object} obj Object to extract from.
	 * @param {string} key Property key to extract from.
	 */
	function extractProperty(obj, key) {
		var value = obj[key];
		delete obj[key];
		return value;
	}

	/**
	 * Convenience function to sanitize classSection notes data from the object
	 * provided in the Cornell Courses API into a plain array of strings.
	 * @param {object} notes Object of notes provided by the Cornell Courses
	 *     API.
	 * @return {array} Array of strings for each element in the original notes
	 *     array.
	 */
	function reduceNotes(notes) {
		return _.map(notes, function(note) {
			return note.descrlong;
		});
	}

	/**
	 * Convenience function to group elements of a flat array together into an
	 * array of arrays. The groups have a size specified by the second
	 * parameter. The last array in the return value may not necessarily have
	 * a length of size.
	 * @param {array} arr Array of elements to group and unflatten.
	 * @param {number} size Size of the element groups.
	 * @return {array} Array of arrays with a maximum length of size.
	 */
	function unflattenArray(arr, size) {
		var newArray = [];
		while (arr.length > 0)
			newArray.push(arr.splice(0, size));
		return newArray;
	}


	/**
	 * Convenience function that takes a two-dimensional array of two-value
	 * arrays and returns an expanded array. The input into this function is an
	 * array of arrays with the first element some value to duplicate and the
	 * second element an array to flatten out.
	 * @param {[type]} arr [description]
	 * @return {[type]}     [description]
	 */
	function expandArray(arr) {
		return _.reduce(arr, function(acc, el) {
			var duplicateValue = el[0];
			return _.map(el, function(secondValueElement) {
				return [duplicateValue, secondValueElement];
			});
		}, []);
	}

	return m;
}

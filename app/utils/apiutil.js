/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Declares reusable and commonly-useful helper functions for the API.
 */

module.exports = function(models) {
	var async = require('async'),
		strutil = require('./strutil'),
		m = {};

	/**
	 * Perform a search with a semester and a query string for relevant courses
	 * and return the courses. This function returns a maximum of course entries
	 * specified by the limit argument.
	 * @param {object} p Params object from the request object.
	 * @param {number} limit Maximum number of course entries to return.
	 * @param {function} callback Callback to call when the operation is
	 *     complete. The first argument passed to callback is an error if an
	 *     error occurred and the second argument passed is the collection of
	 *     course entries that matched the search. If no matching courses are
	 *     found, an empty array is passed as the second argument.
	 * @param {boolean} skipRelated Optional boolean to skip related data.
	 */
	m.searchCourses = function(p, limit, callback, skipRelated) {
		skipRelated = typeof skipRelated === 'undefined' ? false : skipRelated;

		var strm = p.strm,
			query = p.query,
			firstAlphabetic = strutil.firstAlphabeticSubstring(query),
			firstNumeric = strutil.firstNumericSubstring(query),
			firstQuery,
			withRelated = skipRelated ? {} : {
				withRelated: ['groups.sections.meetings.professors']
			};

		if (firstAlphabetic && firstNumeric) {
			firstQuery = new models.course().query(function(qb) {
				qb.where('subject', 'LIKE', '%' + firstAlphabetic + '%')
					.where('catalogNbr', 'LIKE', '%' + firstNumeric + '%')
					.where('strm', strm)
					.limit(limit);
			}).fetchAll(withRelated);
		} else if (firstNumeric) {
			firstQuery = new models.course().query(function(qb) {
				qb.where('catalogNbr', 'LIKE', '%' + firstNumeric + '%')
					.where('strm', strm)
					.limit(limit);
			}).fetchAll(withRelated);
		} else {
			firstQuery = new models.course().query(function(qb) {
				qb.where('subject', 'LIKE', '%' + firstAlphabetic + '%')
					.where('strm', strm)
					.limit(limit);
			}).fetchAll(withRelated);
		}

		async.waterfall([
			function(callback) {
				firstQuery.then(function(courses) {
					if (courses === null)
						courses = [];

					var queryIds = !courses.length ? [] :
						courses.map(function(course) {
							return course.get('id');
						});

					callback(null, courses, queryIds);
				}).catch(function(err) {
					callback(err);
				});
			},
			function(courses, queryIds, callback) {
				if (courses.length < limit) {
					new models.course().query(function(qb) {
						qb.where('titleLong', 'LIKE', '%' + query + '%')
							.where('strm', strm)
							.limit(limit - courses.length);

						if (courses.length)
							qb.whereNotIn('id', queryIds);

					}).fetchAll(withRelated).then(function(additionalCourses) {
						if (additionalCourses === null) {
							if (!courses.length)
								courses = [];
						} else {
							if (!courses.length) {
								courses = additionalCourses;
							} else {
								courses.add(additionalCourses.models);
							}
						}

						queryIds = !courses.length ? [] :
							courses.map(function(course) {
								return course.get('id');
							});

						callback(null, courses, queryIds);
					}).catch(function(err) {
						callback(err);
					});
				} else {
					callback(null, courses, queryIds);
				}
			},
			function(courses, queryIds, callback) {
				if (courses.length < limit) {
					new models.course().query(function(qb) {
						var qbs = query.replace('  ', ' ').split(' ');
						for (var i = 0; i < qbs.length; i++) {
							var q = qbs[i];
							qb.where('titleLong', 'LIKE', '%' + q + '%')
								.where('strm', strm)
								.limit(limit - courses.length);
						}

						if (courses.length)
							qb.whereNotIn('id', queryIds);

					}).fetchAll(withRelated).then(function(additionalCourses) {
						if (additionalCourses === null) {
							if (!courses.length)
								courses = [];
						} else {
							if (!courses.length) {
								courses = additionalCourses;
							} else {
								courses.add(additionalCourses.models);
							}
						}

						queryIds = !courses.length ? [] :
							courses.map(function(course) {
								return course.get('id');
							});

						callback(null, courses, queryIds);
					}).catch(function(err) {
						callback(err);
					});
				} else {
					callback(null, courses, queryIds);
				}
			},
			function(courses, queryIds, callback) {
				if (courses.length < limit) {
					new models.course().query(function(qb) {
						var qbs = query.replace('  ', ' ').split(' ');
						for (var i = 0; i < qbs.length; i++) {
							var q = qbs[i];
							qb.where('description', 'LIKE', '%' + q + '%')
								.where('strm', strm)
								.limit(limit - courses.length);
						}

						if (courses.length)
							qb.whereNotIn('id', queryIds);

					}).fetchAll(withRelated).then(function(additionalCourses) {
						if (additionalCourses === null) {
							if (!courses.length)
								courses = [];
						} else {
							if (!courses.length) {
								courses = additionalCourses;
							} else {
								courses.add(additionalCourses.models);
							}
						}

						queryIds = !courses.length ? [] :
							courses.map(function(course) {
								return course.get('id');
							});

						callback(null, courses, queryIds);
					}).catch(function(err) {
						callback(err);
					});
				} else {
					callback(null, courses, queryIds);
				}
			}
		], function(err, result) {
			callback(null, result);
		});
	};

	/**
	 * Perform a course selection creation operation for a user.
	 * @param {object} user User object of logged in user.
	 * @param {object} p Body object from the request object.
	 * @param {function} callback Callback function to be called when the
	 * 		operation is complete. The function will be called with one
	 *		parameter, an error, if an error occurs. Otherwise, no parameters
	 *		will be passed.
	 */
	m.createSelection = function(user, p, callback) {
		async.parallel([
			function(callback) {
				// Make sure course exists.
				new models.course({ crseId_strm_subject: p.tag }).fetch()
					.then(function(course) {
					if (course === null) {
						callback('Course doesn\'t exist');
						return;
					}

					callback();
				});
			}, function(callback) {
				// Make sure selection doesn't already exist for the course.
				new models.selection({ tag: p.tag, userId: user.id }).fetch()
					.then(function(selection) {
					if ( selection !== null) {
						callback('Course is already selected');
						return;
					}

					callback();
				});
			}
		], function(err) {
			p.userId = user.id;
			prepareSelectionData(p);
			new models.selection(p).save(null, { method: 'insert' })
				.then(function(selection) {
				if (selection === null) {
					callback('something went wrong saving the selection');
					return;
				}

				// Finally get the id.
				new models.selection({
					userId: user.id,
					tag: selection.get('tag')
				}).fetch().then(function(saved) {
					callback(null, saved.get('id'));
				});
			});
		});
	};

	/**
	 * Perform a course selection update operation.
	 * @param {object} user User object of logged in user.
	 * @param {object} p Body object from the request object.
	 * @param {function} callback Callback function to be called when the
	 * 		operation is complete. The function will be called with one
	 *		parameter, an error, if an error occurs. Otherwise, no parameters
	 *		will be passed.
	 */
	m.updateSelection = function(user, p, callback) {
		// Make sure selection belongs to user.
		new models.selection({ id: p.id }).fetch()
			.then(function(selection) {
			if (selection === null)
				return callback('Selection doesn\'t exist');

			if (selection.get('userId') !== user.id)
				return callback('Selection does\'t belong to user.');

			prepareSelectionData(p);

			selection.save(p, { method: 'update' }).then(function() {
				callback();
			});
		});
	};

	/**
	 * Perform a course selection update operation.
	 * @param {object} user User object of logged in user.
	 * @param {object} p Body object from the request object.
	 * @param {function} callback Callback function to be called when the
	 * 		operation is complete. The function will be called with one
	 *		parameter, an error, if an error occurs. Otherwise, no parameters
	 *		will be passed.
	 */
	m.deleteSelection = function(user, p, callback) {
		// Make sure selection belongs to user.
		new models.selection({ id: p.id }).fetch()
			.then(function(selection) {
			if (selection === null)
				return callback('Selection doesn\'t exist');

			if (selection.get('userId') !== user.id)
				return callback('Selection does\'t belong to user.');

			selection.destroy().then(function() {
				callback();
			});
		});
	};

	return m;
};

/**
 * Prepare fields of a selection to the correct form of data before saving or
 * updating.
 */
function prepareSelectionData(data) {
	data.selectedSectionIds = JSON.stringify(data.selectedSectionIds);
	data.active = data.active == 'true';
}

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
	 */
	m.searchCourses = function(p, limit, callback) {
		var strm = p.strm,
			query = p.query,
			firstAlphabetic = strutil.firstAlphabeticSubstring(query),
			firstNumeric = strutil.firstNumericSubstring(query),
			firstQuery,
			withRelated = {
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
	 * @param {object} p Params object from the request object.
	 * @param {function} callback Callback function to be called when the
	 * 		operation is complete. The function will be called with one
	 *		parameter, an error, if an error occurs. Otherwise, no parameters
	 *		will be passed.
	 */
	m.createSelection = function(p, callback) {
		// Make sure user exists.
		new models.user({ id: p.userId }).fetch().then(function(user) {
			if (user === null) {
				callback('User doesn\'t exist');
				return;
			}

			success();
		});

		// Make sure course exists.
		new models.course({ crseId: p.crseId, strm: p.strm }).fetch()
			.then(function(course) {
			if (course === null) {
				callback('Course doesn\'t exist');
				return;
			}

			success();
		});

		// Make sure selection doesn't already exist for the course.
		new models.selection({ crseId: p.crseId, strm: p.strm }).fetch()
			.then(function(selection) {
			if ( selection !== null) {
				callback('Course is already selected');
				return;
			}

			success();
		});

		// All checks must pass.
		var successCount = 3;
		function success() {
			successCount--;
			if (successCount === 0) {
				new models.selection(p).save().then(function(selection) {
					if (selection === null) {
						callback('something went wrong saving the selection');
						return;
					}

					callback();
				});
			}
		}
	};

	return m;
};

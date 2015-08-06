/**
 * Copyright (c) 2015, Davyapp.
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
	 * @param {string} semester Semester slug to perform the query on.
	 * @param {string} query String to search for courses with
	 * @param {number} limit Maximum number of course entries to return.
	 * @param {function} callback Callback to call when the operation is
	 *     complete. The first argument passed to callback is an error if an
	 *     error occurred and the second argument passed is the collection of
	 *     course entries that matched the search. If no matching courses are
	 *     found, an empty array is passed as the second argument.
	 */
	m.searchCourses = function(semester, query, limit, callback) {
		// get semester entry
		new models.semester({
			strm: semester
		}).fetch().then(function(semesterEntry) {
			if (!semesterEntry) {
				callback('No such semester exists');
				return;
			}

			var firstAlphabetic = strutil.firstAlphabeticSubstring(query),
				firstNumeric = strutil.firstNumericSubstring(query),
				firstQuery;

			if (firstAlphabetic && firstNumeric) {
				firstQuery = new models.course().query(function(qb) {
					qb.where('subject', 'LIKE', '%' + firstAlphabetic + '%')
						.where('catalogNbr', 'LIKE', '%' + firstNumeric + '%')
						.limit(limit);
				}).fetchAll();
			} else if (firstNumeric) {
				firstQuery = new models.course().query(function(qb) {
					qb.where('catalogNbr', 'LIKE', '%' + firstNumeric + '%')
						.limit(limit);
				}).fetchAll();
			} else {
				firstQuery = new models.course().query(function(qb) {
					qb.where('subject', 'LIKE', '%' + firstAlphabetic + '%')
						.limit(limit);
				}).fetchAll();
			}

			async.waterfall([
				function(callback) {
					firstQuery.then(function(courses) {
						if (courses == null)
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
								.limit(limit - courses.length);

							if (courses.length)
								qb.whereNotIn('id', queryIds);

						}).fetchAll().then(function(additionalCourses) {
							if (additionalCourses == null) {
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
									.limit(limit - courses.length);
							}

							if (courses.length)
								qb.whereNotIn('id', queryIds);

						}).fetchAll().then(function(additionalCourses) {
							if (additionalCourses == null) {
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
									.limit(limit - courses.length);
							}

							if (courses.length)
								qb.whereNotIn('id', queryIds);

						}).fetchAll().then(function(additionalCourses) {
							if (additionalCourses == null) {
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
		}).catch(function(err) {
			callback(err);
		})
	}

	return m;
}

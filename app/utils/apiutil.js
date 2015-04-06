/**
 * @fileoverview Module for reusable and commonly-useful helper functions
 * for the API.
 */

module.exports = function(models) {
	var strutil = require('./strutil'),
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
			slug: semester
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
						.orWhere('catalogNbr', 'LIKE', '%' + firstNumeric + '%')
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

			firstQuery.then(function(courses) {
				var firstQueryLength = 0,
					firstQueryIds;
				if (courses) {
					firstQueryLength = courses.length;
					firstQueryIds = courses.map(function(course) {
						return course.get('id');
					});
				}

				if (firstQueryLength < limit) {
					new models.course().query(function(qb) {
						qb.where('description', 'LIKE', query)
							.orWhere('titleLong', 'LIKE', query)
							.limit(limit - firstQueryLength);

						if (firstQueryLength)
							qb.whereNotIn('id', firstQueryIds);
					}).fetchAll().then(function(additionalCourses) {
						if (additionalCourses == null) {
							if (courses == null) {
								callback(null, []);
							} else {
								callback(null, courses);
							}
						} else {
							if (courses == null) {
								callback(null, additionalCourses);
							} else {
								courses.add(additionalCourses.models);
								callback(null, courses);
							}
						}
					}).catch(function(err) {
						callback(err);
					})
				} else {
					callback(null, courses);
				}
			});
		}).catch(function(err) {
			callback(err);
		})
	}

	return m;
}

/**
 * @fileoverview Module to perform instructions related to managing course data
 * and handling database entries 
 */

module.exports = function(models) {
	var async = require('async'),
		m = {};

	m.saveCourse = function(course, callback) {

		// extract out enrollGroups
		var enrollGroups = course.enrollGroups;
		delete course['enrollGroups'];

		// flatten catalogOutcomes into one single string field
		course.catalogOutcomes = course.catalogOutcomes ?
			JSON.stringify(course.catalogOutcomes) : null;

		async.waterfall([
			function(callback) {
				new models.course(course).save().then(function(savedCourse) {
					callback(null, savedCourse);
				}).catch(function(err) {
					callback('error');
				});
			},
			function(savedCourse, callback) {
				
			}
		], function(err, result) {
			if (err) {
				callback('error');
			}

			callback();
		});
	}

	return m;
}

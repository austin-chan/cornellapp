/**
 * @fileoverview Util to handle operations related to the application's config.
 */

module.exports = function(config) {
	var _ = require('underscore'),
		m = {};

	/**
	 * Returns the active semester object from the config settings.
	 * @return {object} The semester object taken from the active semester
	 *     specified by the config settings.
	 */
	m.getSemester = function() {
		return _.find(config.semesters, function(semester) {
			return semester.slug == config.semester;
		});
	}

	return m;
}
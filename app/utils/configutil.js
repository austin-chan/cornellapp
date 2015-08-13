/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Declares operations related to the application's config.
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
	};

	return m;
};

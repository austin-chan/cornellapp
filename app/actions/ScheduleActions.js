/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Describes all actions possible to the schedule.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

    /**
     * Add a course to the schedule.
     * @param {object} course Course to add to the schedule.
     */
    add: function(course) {
        AppDispatcher.dispatch({
            actionType: AppConstants.SCHEDULE_ADD,
            course: course
        });
    }
}

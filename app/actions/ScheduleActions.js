/**
 * Copyright (c) 2015, Davyapp.
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
var ScheduleConstants = require('../constants/ScheduleConstants');

module.exports = {

    /**
     * Add a course to the schedule.
     * @param {object} course Course to add to the schedule.
     */
    add: function(course) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.ADD,
            course: course
        });
    }
}

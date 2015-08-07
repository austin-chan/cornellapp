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
    },

    /**
     * Remove a course from the schedule.
     * @param {string} key Key of course to remove.
     */
    remove: function(key) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.REMOVE,
            key: key
        });
    },

    /**
     * Set a course either active or unactive.
     * @param {string} key Key of course to update active state for.
     * @param {bool} active True to make the course active, false to make the
     *      course inactive.
     */
    toggle: function(key, active) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.TOGGLE,
            key: key,
            active: active,
        });
    },

    /**
     * Change the color of a course.
     * @param {string} key Key of course to change the color.
     * @param {string} color Color string to change to.
     */
    setColor: function(key, color) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.SET_COLOR,
            key: key,
            color: color,
        });
    }
}

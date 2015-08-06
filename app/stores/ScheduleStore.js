/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Store to handle the active schedule.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ScheduleConstants = require('../constants/ScheduleConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'schedule_change';

var _courses = {};
var _semester = 2608;

/**
 * Add a course to the ScheduleStore.
 * @param {object} course Course object to add to the ScheduleStore.
 */
function add(course) {
    course = course.data;
    _courses[course.catalogNbr] = {
        raw: course,
        selection: {}
    }
}

var ScheduleStore = assign({}, EventEmitter.prototype, {

    /**
     * Get all of the courses in the schedule.
     * @return {object}
     */
    getCourses: function() {
        return _courses;
    },

    /**
     * Get the active semester for the schedule.
     * @return {object}
     */
    getSemester: function() {
        return _semester;
    },

    /**
     * Publish a change to all listeners.
     */
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * Add a callback function to run during change events.
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * Remove callback function from change event listeners.
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case ScheduleConstants.ADD:
            add(action.course);
            ScheduleStore.emitChange();
            break;
        default:
    }
});

module.exports = ScheduleStore;

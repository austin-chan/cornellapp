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

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    ScheduleConstants = require('../constants/ScheduleConstants'),
    assign = require('object-assign'),
    _ = require('underscore');

var CHANGE_EVENT = 'schedule_change';

var _courses = {},
    _semester = 2608;
    _colors = ['blue', 'purple', 'light-blue', 'red', 'green', 'yellow',
        'pink'];

/**
 * Add a course to the schedule.
 * @param {object} course Course object to add to the ScheduleStore.
 */
function add(course) {
    if (exists(course)) { // ignore course adding if it already exists
        return;
    }

    var selection = generateSelection(course);

    _courses[selection.key] = {
        raw: course,
        selection: selection
    }

    console.log(_courses[selection.key]);
}

/**
 * Remove a course from the schedule.
 * @param {string} key Key of course to remove.
 */
function remove(key) {
    delete _courses[key];
}

/**
 * Toggle a course active state to on or off.
 * @param {string} key Key of course to toggle.
 * @param {boolean} active Active state to set for the course.
 */
function toggle(key, active) {
    _courses[key].selection.active = active;
}

/**
 * Generates a color for a newly added course. The color chosen is done with an
 * attempt to diversify the colors used by the schedule.
 * @return {string} Color string generated.
 */
function generateColor() {
    var existingColors = _.values(_courses).map(function(c) {
            return c.selection.color; }),
        colorList = _colors.slice();

    // Schedule looks best when blue comes up first.
    if (!existingColors.length && _.contains(_colors, 'blue')) {
        return 'blue';
    }

    // Loop through colors already in the schedule.
    for (var c = 0; c < existingColors.length; c++) {
        colorList = _.without(colorList, existingColors[c]);
    }

    // Make sure the color options array is not empty.
    colorList = colorList.length ? colorList : _colors.slice();
    return _.sample(colorList); // _.sample produces a random item
}

/**
 * Generates a default selection object for a course object.
 * @param {object} course Course object to calculate a selection for.
 * @return {object} Default selection object for the course.
 */
function generateSelection(course) {
    var group = course.groups[0],
        components = JSON.parse(course.groups[0].componentsRequired),
        sections = [];

    // Loop through each required component.
    for (var c = 0; c < components.length; c++) {
        var component = components[c];

        // Loop through available sections.
        for (var s = 0; s < group.sections.length; s++) {
            var section = group.sections[s];
            if (section.ssrComponent === component) {
                sections.push(section.section);
                break;
            }
        }
    }

    // Using the current timestamp + random number for the key. This is good
    // enough unless functionality needs to be built to allow the course
    // order to change.
    // 2821109907455 in decimal is base 36 "zzzzzzzz".
    var date = +new Date(),
        key = (2821109907455 - date - Math.floor(Math.random() * 999999))
            .toString(36);

    return {
        key: key,
        color: generateColor(),
        active: true,
        groupSelection: 0,
        sectionSelection: sections
    };
}

/**
 * Determines if course already has been added to the schedule.
 * @param {object} course Course to check against the ScheduleStore.
 * @return {boolean} true if the course exists already, false if not.
 */
function exists(course) {
    return _.any(_.values(_courses), function(c) {
        return course.catalogNbr === c.catalogNbr &&
            course.subject === c.subject;
    });
}

var ScheduleStore = assign({}, EventEmitter.prototype, {

    /**
     * Get a
     */
    getColors: function() {
        return _colors;
    },

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

        case ScheduleConstants.REMOVE:
            remove(action.key);
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.TOGGLE:
            toggle(action.key, action.active);
            ScheduleStore.emitChange();
            break;

        default:
    }
});

module.exports = ScheduleStore;

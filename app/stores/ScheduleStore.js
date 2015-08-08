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
    if (exists(course)) // ignore course adding if it already exists
        return;

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
 * Set the color for a course.
 * @param {string} key Key of course to change the color.
 * @param {string} color Color to change to.
 */
function setColor(key, color) {
    // Make sure color is in _colors and is not already selected.
    if (_colors.indexOf(color) === -1 && color != _courses[key].selection.color)
        return;

    _courses[key].selection.color = color;
}

/**
 * Select a section and deselect the previously selected section of the
 * same type if necessary.
 * @param {string} key Key of the course to change the section selection of.
 * @param {string} sectionId Section ID to add to the course.
 */
function selectSection(key, sectionId) {
    // Make sure the newly selected section is not already selected.
    if (_courses[key].selection.selectedSectionIds.indexOf(sectionId) !== -1)
        return;

    var course = _courses[key],
        section = getSection(key, sectionId);

    deselectSectionType(key, section.ssrComponent);

    // Add the desired section to the course selection.
    course.selection.selectedSectionIds.push(sectionId);
}

/**
 * Deselect a section type from a course selection. Used in cases where
 * courses have optional components.
 * @param {string} key Key of the course to deselect a section from.
 * @param {string} sectionType Type of section to deselect.
 */
function deselectSectionType(key, sectionType) {
    var course = _courses[key],
        selectedSectionOfType = getSelectedSectionOfType(key,
            sectionType);

    // If an existing section of the same type is already selected, deselect it.
    if (selectedSectionOfType) {
        var index = course.selection.selectedSectionIds
            .indexOf(selectedSectionOfType.section);

        course.selection.selectedSectionIds.splice(index, 1);
    }
}

/**
 * Generates a default selection object for a course object.
 * @param {object} course Course object to calculate a selection for.
 * @return {object} Default selection object for the course.
 */
function generateSelection(course) {
    var group = course.groups[0],
        sections = [],
        components = JSON.parse(course.groups[0].componentsRequired).concat(
            JSON.parse(course.groups[0].componentsOptional));

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
    var key = (+new Date() + Math.floor(Math.random() * 100))
        .toString(36);

    return {
        key: key,
        color: generateColor(),
        active: true,
        selectedSectionIds: sections
    };
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
 * Get the selected group for a course.
 * @param {string} key Key for the course to retrieve group for.
 * @return {object} Selected group of the course.
 */
function getGroup(key) {
    var course = _courses[key],
        sectionChoice = course.selection.selectedSectionIds[0];

    return _.find(course.raw.groups, function(group) {
        return _.some(group.sections, function(section) {
            return section.section == sectionChoice;
        });
    });
}

/**
 * Get a particular section for a group.
 * @param {string} key Key for the associated course.
 * @param {string} sectionId Section ID to retrieve.
 * @return {object} Section object that was requested.
 */
function getSection(key, sectionId) {
    for (var g = 0; g < _courses[key].raw.groups.length; g++) {
        var group = _courses[key].raw.groups[g];
        for (var s = 0; s < group.sections.length; s++) {
            var section = group.sections[s];
            if (section.section == sectionId)
                return section;
        }
    }
}

/**
 * Get all sections for a course of a certain ssrComponent type either
 * limited to the selected group or not.
 * @param {string} key Key for the course to retrieve sections from.
 * @param {string} sectionType The ssrComponent type to retrieve from.
 * @param {boolean} inGroup Limit only to the selected group.
 * @return {array} List of sections of the type.
 */
function getSectionsOfType(key, sectionType, inGroup) {
    var course = _courses[key],
        sections = [];

    groups = inGroup ? [getGroup(key)] : course.raw.groups;

    // Loop through each group.
    _.each(groups, function(group) {

        // Loop through each section of the group.
        _.each(group.sections, function(section) {
            if (section.ssrComponent == sectionType)
                sections.push(section);
        });
    });

    return sections;
}

/**
 * Get the selected section for a course of a section type.
 * @param {string} key Key of course to retrieve section from.
 * @param {string} sectionType Section type to retrieve.
 * @return {object} Selected section object of the type or undefined if no
 *      sections of the type are selected.
 */
function getSelectedSectionOfType(key, sectionType) {
    var selectedSectionId = _.find(_courses[key].selection.selectedSectionIds,
        function(selectedSectionId) {
            var selectedSection = getSection(key, selectedSectionId);
            return selectedSection.ssrComponent === sectionType;
        });

    return selectedSectionId ? getSection(key, selectedSectionId) : undefined;
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
     * Get all available colors for courses.
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
     * Get the selected group for a course.
     * @param {string} key Key for the course to retrieve group for.
     * @return {object} Selected group of the course.
     */
    getGroup: function(key) {
        return getGroup(key);
    },

    /**
     * Get a particular section for a group.
     * @param {string} key Key for the associated course.
     * @param {string} sectionId Section ID to retrieve.
     * @return {object} Section object that was requested.
     */
    getSection: function(key, sectionId) {
        return getSection(key, sectionId);
    },

    /**
     * Get all sections for a course of a certain ssrComponent type either
     * limited to the selected group or not.
     * @param {string} key Key for the course to retrieve sections from.
     * @param {string} sectionType The ssrComponent type to retrieve from.
     * @param {boolean} inGroup Limit only to the selected group.
     * @return {array} List of sections of the type.
     */
    getSectionsOfType: function(key, sectionType, inGroup) {
        inGroup = typeof inGroup !== 'undefined' ? inGroup : false;
        return getSectionsOfType(key, sectionType, inGroup);
    },

    /**
     * Get the selected section for a course of a section type.
     * @param {string} key Key of course to retrieve section from.
     * @param {string} sectionType Section type to retrieve.
     * @return {object} Selected section object of the type or undefined if no
     *      sections of the type are selected.
     */
    getSelectedSectionOfType: function(key, sectionType) {
        return getSelectedSectionOfType(key, sectionType);
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

        case ScheduleConstants.SET_COLOR:
            setColor(action.key, action.color);
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.SELECT_SECTION:
            selectSection(action.key, action.sectionId);
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.DESELECT_SECTION_TYPE:
            deselectSectionType(action.key, action.sectionType);
            ScheduleStore.emitChange();
            break;

        default:
    }
});

module.exports = ScheduleStore;

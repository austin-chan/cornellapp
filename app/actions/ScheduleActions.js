/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Describes all actions possible to the schedule.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ScheduleConstants = require('../constants/ScheduleConstants');

var ScheduleActions = {
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
     * Remove a course or event from the schedule.
     * @param {string} key Key of course or event to remove.
     */
    remove: function(key) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.REMOVE,
            key: key
        });
    },

    /**
     * Remove a course from the schedule by the course object.
     * @param {string} course Course object to remove.
     */
    removeCourse: function(course) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.REMOVE_COURSE,
            course: course
        });
    },

    /**
     * Set a course or event either active or unactive.
     * @param {string} key Key of course or event to update active state for.
     * @param {bool} active True to make the course or event active, false to
     *      make the course inactive.
     */
    toggle: function(key, active) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.TOGGLE,
            key: key,
            active: active
        });
    },

    /**
     * Change the color of a course or event.
     * @param {string} key Key of course or event to change the color.
     * @param {string} color Color string to change to.
     */
    setColor: function(key, color) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.SET_COLOR,
            key: key,
            color: color
        });
    },

    /**
     * Select a section and deselect the previously selected section of the
     * same type if necessary.
     * @param {string} key Key of the course to change the section selection of.
     * @param {string} sectionId Section ID to add to the course.
     */
    selectSection: function(key, sectionId) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.SELECT_SECTION,
            key: key,
            sectionId: sectionId
        });
    },

    /**
     * Deselect a section type from a course selection. Used in cases where
     * courses have optional components.
     * @param {string} key Key of the course to deselect a section from.
     * @param {string} sectionType Type of section to deselect.
     */
    deselectSectionType: function(key, sectionType) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.DESELECT_SECTION_TYPE,
            key: key,
            sectionType: sectionType
        });
    },

    /**
     * Select a number of credits for a course.
     * @param {string} key Key of the course to change the section selection of.
     * @param {string} credits Number of credits to apply for the course.
     */
    selectCredits: function(key, credits) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.SELECT_CREDITS,
            key: key,
            credits: parseFloat(credits)
        });
    },

    /**
     * Add an event to the schedule.
     */
    addEvent: function() {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.ADD_EVENT
        });
    },

    /**
     * Change the name of an event.
     * @param {string} key Key of the event to change the name for.
     * @param {string} name Name to change to.
     */
    changeEventName: function(key, name) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.CHANGE_EVENT_NAME,
            key: key,
            name: name
        });
    },

    /**
     * Change the location of an event.
     * @param {string} key Key of the event to change the location for.
     * @param {string} location Location to change to.
     */
    changeEventLocation: function(key, location) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.CHANGE_EVENT_LOCATION,
            key: key,
            location: location
        });
    },

    /**
     * Toggle an event on or off for day.
     * @param {string} key Key of the event to change the time for.
     * @param {string} time Time to change the event to.
     * @param {boolean} isEndTime True to change the end time, false to change
     *      the start time.
     */
    changeEventTime: function(key, time, isEndTime) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.CHANGE_EVENT_TIME,
            key: key,
            time: time,
            isEndTime: isEndTime
        });
    },

    /**
     * Toggle an event on or off for day.
     * @param {string} key Key of the event to toggle a day for.
     * @param {string} daySlug Day to toggle for the event.
     * @param {boolean} selected Select or Deselect the day.
     */
    toggleEventDay: function(key, daySlug, selected) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.TOGGLE_EVENT_DAY,
            key: key,
            daySlug: daySlug,
            selected: selected
        });
    },

    /**
     * Reinitialize the course list as empty in the event of logout.
     */
    clear: function() {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.CLEAR
        });
    },

    /**
     * Change the active semester.
     * @param {string} semester Slug of the semester to set as active.
     */
    changeSemester: function(semester) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.CHANGE_SEMESTER,
            semester: semester
        });
    },

    /**
     * Merge a course selection payload from the backend into the store.
     * @param {object} data Course selection data payload.
     */
    merge: function(data) {
        AppDispatcher.dispatch({
            actionType: ScheduleConstants.MERGE,
            data: data
        });
    }
};

module.exports = ScheduleActions;

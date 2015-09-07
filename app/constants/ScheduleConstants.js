/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Constants for the Flux dispatcher to use during schedule actions.
 */

module.exports = {
    ADD: 'SCHEDULE_ADD',
    REMOVE: 'SCHEDULE_REMOVE',
    REMOVE_COURSE: 'SCHEDULE_REMOVE_COURSE',
    TOGGLE: 'SCHEDULE_TOGGLE',
    SET_COLOR: 'SCHEDULE_SET_COLOR',
    SELECT_SECTION: 'SCHEDULE_SELECT_SECTION',
    DESELECT_SECTION_TYPE: 'SCHEDULE_DESELECT_SECTION_TYPE',
    SELECT_CREDITS: 'SCHEDULE_SELECT_CREDITS',
    ADD_EVENT: 'SCHEDULE_ADD_EVENT',
    CHANGE_EVENT_NAME: 'SCHEDULE_CHANGE_EVENT_NAME',
    CHANGE_EVENT_LOCATION: 'SCHEDULE_CHANGE_EVENT_LOCATION',
    CHANGE_EVENT_TIME: 'SCHEDULE_CHANGE_EVENT_TIME',
    TOGGLE_EVENT_DAY: 'SCHEDULE_TOGGLE_EVENT_DAY',
    CLEAR: 'SCHEDULE_CLEAR',
    CHANGE_SEMESTER: 'SCHEDULE_CHANGE_SEMESTER',
    MERGE: 'SCHEDULE_MERGE'
};

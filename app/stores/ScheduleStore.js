/**
 * Copyright (c) 2015, Cornellapp.
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
    UserStore = require('./UserStore'),
    assign = require('object-assign'),
    moment = require('moment'),
    config = require('../../config'),
    _ = require('underscore');

var CHANGE_EVENT = 'schedule_change';

var _courses = {},
    _semester = {},
    _data = {},
    _colors = ['blue', 'purple', 'light-blue', 'red', 'green', 'yellow',
        'pink'],
    _dayMap = {
        M: 'monday',
        T: 'tuesday',
        W: 'wednesday',
        R: 'thursday',
        F: 'friday',
        S: 'saturday',
        Su: 'sunday'
    },
    _requestCount = 0;

/**
 * Restore store data from the render context on client side.
 */
if (process.env.NODE_ENV === 'browserify')
    restore(context.ScheduleStoreSnapshot);

/**
 * Generate the render context on server side.
 */
else
    var reset = function(req) {
        var snapshot = {};

        // Mount the course selection data.
        if (req.isAuthenticated())
            snapshot._data = req.user.getSelectionData();
        else
            snapshot._data = _.mapObject(config.semesters, function(s) {
                return {};
            });

        // Use a cookie set semester if it is set.
        if (req.cookies.semester_slug &&
            config.semesters[req.cookies.semester_slug])
            snapshot._semester = config.semesters[req.cookies.semester_slug];
        // Or use the semester specified in config.
        else
            snapshot._semester = config.semesters[config.semester];

        restore(snapshot);
    };

/**
 * Generate a snapshot that can be converted to JSON and used by another
 * instance of the store to restore it back to an identical state.
 */
function snapshot() {
    _data[_semester.slug] = _courses;

    return {
        _data: _data,
        _semester: _semester
    };
}

/**
 * Restore the state of the store from a snapshot.
 * @param {object} snapshot Snapshot to return state to.
 */
function restore(snapshot) {
    _data = snapshot._data;
    _semester = snapshot._semester;
    _courses = _data[_semester.slug];
}

/**
 * Add a course to the schedule.
 * @param {object} course Course object to add to the ScheduleStore.
 */
function add(course) {
    if (exists(course)) // ignore course adding if it already exists
        return;

    var selection = defaultSelection(course);
    _courses[selection.key] = {
        raw: course,
        selection: selection
    };

    // Server side persist if logged in user.
    if (UserStore.getUser() !== false)
        request('post', _courses[selection.key]).success(function(data) {
            if (_courses[selection.key])
                _courses[selection.key].selection.id = data;
        });

    console.log(_courses[selection.key]);
}

/**
 * Remove a course from the schedule.
 * @param {string} key Key of course to remove.
 */
function remove(key) {
    request('delete', _courses[key]);
    delete _courses[key];
}

/**
 * Toggle a course active state to on or off.
 * @param {string} key Key of course to toggle.
 * @param {boolean} active Active state to set for the course.
 */
function toggle(key, active) {
    var course = _courses[key];
    _courses[key].selection.active = active;

    request('put', _courses[key]);
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
    request('put', _courses[key]);
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
        previousGroup = getSelectedGroup(key),
        section = getSection(key, sectionId),
        newGroup = getGroupOfSection(key, sectionId);

    // Section selection across groups requires repicking all the sections.
    if (newGroup.id !== previousGroup.id) {
        // Reassign all selected section ids.
        course.selection.selectedSectionIds =
            defaultSectionIdSelections(newGroup);
    }

    // Remove the section of the same type as the newly selected section.
    deselectSectionType(key, section.ssrComponent);

    // Add the desired section to the course selection.
    course.selection.selectedSectionIds.push(sectionId);

    request('put', _courses[key]);
}

/**
 * Change the active semester.
 * @param {string} semester Slug of the semester to set as active.
 */
function changeSemester(semester) {
    // Skip if already selected.
    if (semester === _semester.slug)
        return;

    var semesterExists = _.find(_.values(config.semesters), function(s) {
        return s.slug === semester.slug;
    });

    // Make sure semester slug exists.
    if (!semesterExists)
        return;

    // Save the active _courses into _data.
    _data[_semester.slug] = _courses;

    // Swap the new semester into _courses, like a context switch.
    _courses = _data[semesterExists.slug];

    // Finally change the semester.
    _semester = semesterExists;
}

/**
 * Merge a course selection payload from the backend into the store.
 * @param {object} data Course selection data payload.
 */
function merge(data) {
    console.log('i');
    // Write _courses back to _data, like writing from registers to memory.
    _data[_semester.slug] = _courses;

    // No courses were loaded client side.
    var originallyEmpty = _.every(_data, function(s) {
        return _.isEmpty(s);
    });

    _.each(data, function(semesterData, slug) {
        _.each(semesterData, function(course, key) {
            // Skip if course is already in the store.
            var exists = _.some(_data[slug], function(c) {
                    return c.selection.tag === course.selection.tag;
                });
            if (exists)
                return;

            // Move into the store.
            _data[slug][key] = course;
        });
    });

    // Restore _courses from _data, like the L1 cache if you've taken 3410.
    _courses = _data[_semester.slug];

    if (originallyEmpty)
        return;

    // Then send the whole package to the backend to sync, but omit the raw
    // component because it is too big.
    var d = _.mapObject(_data, function(semesterData) {
        return _.mapObject(semesterData, function(course) {
            return _.omit(course, 'raw');
        });
    });
    _requestCount++;
    $.ajax({
        type: 'post',
        url: '/api/selection/sync',
        data: {
            _data: d
        }
    }).always(function() {
        _requestCount--;
    });
}

/**
 * Deselect a section type from a course selection. Used in cases where
 * courses have optional components.
 * @param {string} key Key of the course to deselect a section from.
 * @param {string} sectionType Type of section to deselect.
 * @param {boolean} sendRequest Persist the change by sending a request to the
 *      back end.
 */
function deselectSectionType(key, sectionType, sendRequest) {
    sendRequest = sendRequest = typeof sendRequest !== 'undefined' ?
        sendRequest : false;

    var course = _courses[key],
        selectedSectionOfType = getSelectedSectionOfType(key,
            sectionType);

    // If an existing section of the same type is already selected, deselect it.
    if (selectedSectionOfType) {
        course.selection.selectedSectionIds = _.reject(
            course.selection.selectedSectionIds,
            function(sectionId) {
                return selectedSectionOfType.section === sectionId;
        });
    }

    if (sendRequest)
        request('put', _courses[key]);
}

/**
 * Initiate a request to persist data about selections.
 * @param {string} type Method of request.
 * @param {object} course Course object to save or delete.
 * @param {object} The jqXHR object for the request.
 */
function request(type, course) {
    if (!UserStore.isLoggedIn())
        return;

    // Skip if doesn't have id loaded for update or delete requests;
    if ((type === 'put' || type === 'delete') && !course.selection.id)
        return;

    // Generate request data object.
    var data;
    if (type === 'post') {
        var raw = course.raw;
        data = JSON.parse(JSON.stringify(course.selection));
        data.strm = _semester.strm;
    } else if (type === 'put') {
        data = JSON.parse(JSON.stringify(course.selection));
    } else if (type === 'delete') {
        data = {
            id: course.selection.id
        };
    }

    _requestCount++;
    return $.ajax({
        type: type,
        url: '/api/selection',
        data: data
    }).always(function() {
        _requestCount--;
    });
}

/**
 * Generates a default selection object for a course object.
 * @param {object} course Course object to calculate a selection for.
 * @return {object} Default selection object for the course.
 */
function defaultSelection(course) {
    // Using the current timestamp + random number for the key. This is good
    // enough unless functionality needs to be built to allow the course
    // order to change.
    var group = course.groups[0],
        key = (+new Date() + Math.floor(Math.random() * 100))
        .toString(36);

    return {
        tag: course.crseId + '_' + course.strm + '_' + course.subject,
        key: key,
        color: generateColor(),
        active: true,
        selectedSectionIds: defaultSectionIdSelections(group)
    };
}

/**
 * Generate default section id selections for a group based on its required and
 * optional components.
 * @param {object} group Group object to generate section id selections for.
 * @return {array} List of section id defaults for the group.
 */
function defaultSectionIdSelections(group) {
    var sections = [],
        allSelectedSections = getAllSelectedSections(),
        components = JSON.parse(group.componentsRequired).concat(
            JSON.parse(group.componentsOptional));

    // Loop through each required and optional component.
    for (var c = 0; c < components.length; c++) {
        var component = components[c];

        sections.push(defaultSectionInGroupOfType(group, component,
            allSelectedSections.concat(sections)));
    }

    return _.map(sections, function(s){
        return s.section;
    });
}

/**
 * Generates the default section choice for a section type in a group.
 * Attempting to avoid section selection schedule conflicts as much as possible.
 * @param {object} group Group object to retrieve section from.
 * @param {string} sectionType Type of section to choose a default value for.
 * @param {array} addedSections Existing already added sections to attempt to
 *      avoid conflicting with.
 * @return {object} Chosen default section object.
 */
function defaultSectionInGroupOfType(group, sectionType, addedSections) {
    var sections = getSectionsOfType(null, sectionType, group);

    // Loop through all section options and pick the first one that doesn't
    // conflict with the schedule.
    for (var s = 0; s < sections.length; s++) {
        var section = sections[s];

        if (!conflictInSections(addedSections.concat(section))) {
            return section;
        }
    }

    // None of the sections don't conflict. Just choose the first option.
    return sections[0];
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
function getSelectedGroup(key) {
    return getGroupOfSection(key,
        _courses[key].selection.selectedSectionIds[0]);
}

/**
 * Get the group object for a section.
 * @param {string} key Key for the course to retrieve group for.
 * @param {string} sectionId Section to request group for.
 * @return {object} Group that contains the section.
 */
function getGroupOfSection(key, sectionId) {
    return _.find(_courses[key].raw.groups, function(group) {
        return _.some(group.sections, function(section) {
            return section.section === sectionId;
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
 * Get all selected sections for a course.
 * @param {string} key Key to get selected sections from.
 * @return {array} List of selected sections for the course.
 */
function getSelectedSections(key) {
    return _.map(_courses[key].selection.selectedSectionIds,
        function(sectionId) {
            return getSection(key, sectionId);
    });
}

/**
 * Get all selected sections contained in the schedule.
 * @return {array} List of all selected section objects.
 */
function getAllSelectedSections() {
    // Map each course with each of its selected section objects.
    var sectionsMap = _.mapObject(_courses, function(course, key) {
        return getSelectedSections(key);
    });

    return _.flatten(_.values(sectionsMap));
}

/**
 * Get all sections for a course of a certain ssrComponent type either
 * limited to the selected group or not.
 * @param {string} key Key for the course to retrieve sections from.
 * @param {string} sectionType The ssrComponent type to retrieve from.
 * @param {boolean|object} inGroup Limit only to the supplied group if a group
 *      object is supplied. Otherwise retrieve sections from all groups in the
 *      course.
 * @return {array} List of sections of the type.
 */
function getSectionsOfType(key, sectionType, inGroup) {
    var sections = [],
        groups = inGroup ? [inGroup] : _courses[key].raw.groups;

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
 * Create a moment object for a time string. The day for the moment object
 * is set to January 1, 2000. Example: "04:30PM".
 * @param {string} time String representation of a time of day.
 * @return {object} Moment object representation of the time.
 */
function momentForTime(time) {
    // If doesn't have two digits before colon for some reason.
    if (time.indexOf(':') < 2)
        time = '0' + time;

    // Convert 12 hour to 24 hour time.
    // Taken from http://stackoverflow.com/a/17555888.
    var hours = parseInt(time.substr(0, 2));
    time = time.toUpperCase();
    if(time.indexOf('AM') !== -1 && hours == 12)
        time = time.replace('12', '0');
    if(time.indexOf('PM') !== -1 && hours < 12)
        time = time.replace(hours, (hours + 12));

    var splitTime = time.replace(/(AM|PM)/, '').split(/[^0-9]/);

    return moment(new Date(2000, 0, 1, parseInt(splitTime[0]),
        parseInt(splitTime[1])));
}

/**
 * Calculate the number of unit of time measurements between two times with
 * float precision.
 * @param {string} bTime Time string minuend.
 * @param {string} aTime Time string subtrahend.
 * @param {string} unit Unit of measurment to measure the difference in.
 *      Defaults to 'hours'.
 * @return {number} The difference in time measured in number of unit.
 */
function timeDifference(bTime, aTime, unit) {
    unit = typeof unit !== 'undefined' ?  unit : 'hours';

    return momentForTime(bTime).diff(momentForTime(aTime), unit, true);
}

/**
 * Generate a map representation of the interlapping of all the meetings
 * contained in the sections in sectionList.
 * @param {array} sectionList Array of sections to generate the conflict map
 *      for.
 * @return {array} Conflict map representation of all the sections. The map
 *      is structured as an array of 7 arrays, one for each day of the week.
 *      Each index of the subarrays represents a 5 minute period, and the
 *      subarrays' length is 288 representing a full 24 hours of the day. A
 *      value of 0 in the subarray indicates that no meeting takes place during
 *      that 5 minute period. A value of 1 indicates that one meeting takes
 *      place, and a value of 2 indicates that there is a conflict during that
 *      period, or at least 2 meetings overlap during that period.
 */
function generateConflictMap(sectionList) {
    // Create an array with seven subarrays, each with 288 zeroes initialized.
    var midnight = "12:00AM",
        map = _.times(7, function() {
            return _.times(288, function() { return 0; });
        });

    // Loop through all sections in the list.
    _.each(sectionList, function(section) {
        iterateInstancesInSection(section,
            function(meeting, meetingIndex, day) {

            var dayIndex = _.keys(_dayMap).indexOf(day),
                // Calculate corresponding map indices for the meeting start and
                // end times.
                startIndex = timeDifference(meeting.timeStart, midnight,
                    'minutes'),
                endIndex = timeDifference(meeting.timeEnd, midnight, 'minutes');

            startIndex = Math.round(startIndex / 5);
            endIndex = Math.round(endIndex / 5);

            // Loop through all 5 minute periods in between the start and end
            // time and mark it as conflicted (1) or conflicted (2).
            for (var i = startIndex; i < endIndex; i++) {
                map[dayIndex][i] = Math.min(map[dayIndex][i] + 1, 2);
            }

        });
    });

    return map;
}

/**
 * Determine if there are any conflicts with any of the sections in
 * sectionList.
 * @param {array} sectionList Array of section objects to check against
 *      each other.
 * @return {boolean} False if there are no conflicts, true if there are
 *      conflicts.
 */
function conflictInSections(sectionList) {
    return _.flatten(generateConflictMap(sectionList)).indexOf(2) !== -1;
}

/**
 * Iterate through each instance of a section and perform a callback function
 * supplied.
 * @param {object} section Section object to iterate through.
 * @param {function} callback Callback function to perform on each iteration.
 *      The callback receives three parameters: the meeting object, the meeting
 *      index in the section, and the day string.
 */
function iterateInstancesInSection(section, callback) {
    // Loop through each meeting of the section.
    _.each(section.meetings, function(meeting, meetingIndex) {

        // Filter empty strings, handles TBA cases.
        var days = _.pick(meeting.pattern.split(/(?=[A-Z])/),
            _.identity);

        // Loop through each letter in the pattern of the meeting.
        _.each(days, function(day) {

            callback(meeting, meetingIndex, day);
        });
    });
}

/**
 * Determines if course already has been added to the schedule.
 * @param {object} course Course to check against the ScheduleStore.
 * @return {boolean} true if the course exists already, false if not.
 */
function exists(course) {
    return _.any(_.values(_courses), function(c) {
        c = c.raw;
        return course.catalogNbr === c.catalogNbr &&
            course.subject === c.subject;
    });
}

/**
 * Reinitializes the course list as empty in the event of logout.
 */
function clear() {
    _courses = {};
}

var ScheduleStore = assign({}, EventEmitter.prototype, {
    /**
     * Get all available colors for courses.
     * @return {array} List of color strings.
     */
    getColors: function() {
        return _colors;
    },

    /**
     * Get the day map that represents the possible day options in the pattern
     * attribute of all meetings options.
     * @return {object} Day map representation of possible day options.
     */
    getDayMap: function() {
        return _dayMap;
    },

    /**
     * Get all of the courses in the schedule ordered from most recent to
     * oldest.
     * @return {array} Ordered list of course keys.
     */
    getCourses: function() {
        return _.map(_.sortBy(_.keys(_courses)).reverse(), function(key) {
            return _courses[key];
        });
    },

    /**
     * Get the active semester for the schedule.
     * @return {object} Active semester object.
     */
    getSemester: function() {
        return _semester;
    },

    /**
     * Get a list of all available semester objects.
     * @return {array} List of all possible semester objects.
     */
    getSemesters: function() {
        return _.values(config.semesters);
    },

    /**
     * Get the selected group for a course.
     * @param {string} key Key for the course to retrieve group for.
     * @return {object} Selected group of the course.
     */
    getSelectedGroup: getSelectedGroup,

    /**
     * Get a particular section for a group.
     * @param {string} key Key for the associated course.
     * @param {string} sectionId Section ID to retrieve.
     * @return {object} Section object that was requested.
     */
    getSection: getSection,

    /**
     * Get all selected sections for a course.
     * @param {string} key Key to get selected sections from.
     * @return {array} List of selected sections for the course.
     */
    getSelectedSections: getSelectedSections,

    /**
     * Get section options for a course of a certain ssrComponent type. If the
     * section is not the course's primary type, limit the sections to the
     * currently selected group. Otherwise get options from all groups.
     * @param {string} key Key for the course to retrieve sections from.
     * @param {string} sectionType The ssrComponent type to retrieve from.
     * @return {array} List of sections of the type.
     */
    getSectionOptionsOfType: function(key, sectionType) {
        var primarySectionType = getSelectedGroup(key).componentsRequired[0],
            isPrimary = sectionType === primarySectionType;

        return getSectionsOfType(key, sectionType,
            isPrimary ? [getSelectedGroup(key)] : false);
    },

    /**
     * Get the selected section for a course of a section type.
     * @param {string} key Key of course to retrieve section from.
     * @param {string} sectionType Section type to retrieve.
     * @return {object} Selected section object of the type or undefined if no
     *      sections of the type are selected.
     */
    getSelectedSectionOfType: getSelectedSectionOfType,

    /**
     * Calculate the number of unit of time measurements between two times. with
     * float precision.
     * @param {string} bTime Time string minuend.
     * @param {string} aTime Time string subtrahend.
     * @param {string} unit Unit of measurment to measure the difference in.
     *      Defaults to 'hour'.
     * @return {number} The difference in time measured in number of unit.
     */
    timeDifference: timeDifference,

    /**
     * Iterate through each instance of a section and perform a callback function
     * supplied.
     * @param {object} section Section object to iterate through.
     * @param {function} callback Callback function to perform on each iteration.
     */
    iterateInstancesInSection: iterateInstancesInSection,

    /**
     * Determine if there are any conflicts with any of the sections in
     * sectionList.
     * @param {array} sectionList Array of section objects to check against
     *      each other.
     * @return {boolean} False if there are no conflicts, true if there are
     *      conflicts.
     */
    conflictInSections: conflictInSections,

    /**
     * Generate a snapshot that can be converted to JSON and used by another
     * instance of the store to restore it back to an identical state.
     */
    snapshot: snapshot,

    /**
     * Restore the state of the store from a snapshot.
     * @param {object} snapshot Snapshot to return state to.
     */
    restore: restore,

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

// Attach the server side reset method.
if (process.env.NODE_ENV !== 'browserify') {
    ScheduleStore.reset = reset;
}

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
            deselectSectionType(action.key, action.sectionType, true);
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.CLEAR:
            clear();
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.CHANGE_SEMESTER:
            changeSemester(action.semester);
            ScheduleStore.emitChange();
            break;

        case ScheduleConstants.MERGE:
            merge(action.data);
            ScheduleStore.emitChange();
            break;

        default:
    }
});

module.exports = ScheduleStore;

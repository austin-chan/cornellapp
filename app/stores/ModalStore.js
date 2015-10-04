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
    ModalConstants = require('../constants/ModalConstants'),
    ScheduleStore = require('./ScheduleStore'),
    UserStore = require('./UserStore'),
    assign = require('object-assign'),
    moment = require('moment'),
    _ = require('underscore');

var CHANGE_EVENT = 'schedule_change';

var _active = false,
    _modalType,
    _modalData,
    _catalogData,
    _catalogStack,
    _catalogStackForward,
    _schedules = {};

/**
 * Initialize the store.
 */
catalogReset();

/**
 * Restore store data from the render context on client side.
 */
if (process.env.NODE_ENV === 'browserify')
    restore(context.ModalStoreSnapshot);

/**
 * Generate the render context on server side.
 */
else
    var reset = function(user) {
        var snapshot = {};

        if (user)
            snapshot._schedules = user.schedulesMap();
        else
            snapshot._schedules = {};

        restore(snapshot);
    };

/**
 * Generate a snapshot that can be converted to JSON and used by another
 * instance of the store to restore it back to an identical state.
 */
function snapshot() {
    return {
        _schedules: _schedules
    };
}

/**
 * Restore the state of the store from a snapshot.
 * @param {object} snapshot Snapshot to return state to.
 */
function restore(snapshot) {
    _schedules = snapshot._schedules;
}

/**
 * Activate the login modal to appear.
 */
function login() {
    _active = 'modal';
    _modalType = 'login';
}

/**
 * Activate the signup modal to appear.
 */
function signup() {
    _active = 'modal';
    _modalType = 'signup';
}

/**
 * Activate the account activation modal to appear.
 * @param {string} netid Netid of account waiting to be activated.
 */
function activation(netid) {
    _active = 'modal';
    _modalType = 'activation';
    _modalData = {
        netid: netid
    };
}

/**
 * Activate the account view panel.
 */
function account() {
    _active = 'modal';
    _modalType = 'account';
    _modalData = {
        name: UserStore.getUser().name
    };
}

/**
 * Activate the enrollment info view panel.
 */
function enrollment() {
    _active = 'modal';
    _modalType = 'enrollment';
    _modalData = {
        courses: ScheduleStore.getCourses()
    };
}

/**
 * Activate the send schedule view panel.
 */
function sendSchedule() {
    _active = 'modal';
    _modalType = 'send-schedule';
    _modalData = {
        schedule: getSchedule(ScheduleStore.getSemester().slug)
    };
}

/**
 * Activate the catalog view.
 * @param {}
 */
function catalog(page) {
    _active = 'catalog';

    if (page) {
        setCatalogPage(page);
    }
}

/**
 * Load the catalog previous page.
 */
function catalogBack() {
    // Skip if there is no previous page.
    if (_catalogStack.length < 2)
        return;

    var popped = _catalogStack.pop();
    _catalogStackForward.push(popped);
}

/**
 * Load the catalog previous page.
 */
function catalogForward() {
    // Skip if there is no next page.
    if (_catalogStackForward.length === 0)
        return;

    var popped = _catalogStackForward.pop();
    _catalogStack.push(popped);
}

/**
 * Reset the catalog to the default page and clear all history.
 */
function catalogReset() {
    _catalogStack = [];
    _catalogStackForward = [];
    setCatalogPage({
        type: 'subjects',
        title: 'All Subjects'
    });
}

/**
 * Set the catalog's page.
 */
function setCatalogPage(page) {
    var currentPage = _.last(_catalogStack);

    page.strm = ScheduleStore.getSemester().strm;

    // Skip if page is already in view.
    if (_.isEqual(currentPage, page))
        return;

    _catalogStackForward = [];
    _catalogStack.push(page);
}

/**
 * Deactivate all modals and catalog.
 */
function close() {
    _active = false;
}

/**
 * Get a user's schedule information for a semester.
 * @param {string} semester Semester slug to get the user schedule for.
 * @return {object} Schedule object for the semester or null if the user
 *      does not have a schedule created for that semester yet.
 */
function getSchedule(semester) {
    return _schedules[semester];
}

/**
 * Add a schedule to the user's list of schedules.
 * @param {object} schedule Schedule information to add to the user's list of
 *      schedules.
 */
function addSchedule(schedule) {
    _schedules[schedule.semester] = schedule.id;

    // Refresh the modal if it is still on the schedule screen.
    if (_modalType === 'send-schedule') {
        sendSchedule();
    }
}

var ModalStore = assign({}, EventEmitter.prototype, {
    /**
     * Get the state of the modal to render.
     * @return {object} State of the modal component.
     */
    getModalState: function() {
        return {
            active: _active === 'modal',
            type: _modalType,
            data: _modalData
        };
    },

    /**
     * Get the state of the catalog to render.
     * @return {object} State of the catalog.
     */
    getCatalogState: function() {
        return {
            active: _active === 'catalog',
            page: _.last(_catalogStack),
            hasBack: _catalogStack.length > 1,
            hasForward: _catalogStackForward.length !== 0
        };
    },

    /**
     * Reset the catalog to the default page and clear all history.
     */
    reset: catalogReset,

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
    ModalStore.reset = reset;
}

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case ModalConstants.LOGIN:
            login();
            ModalStore.emitChange();
            break;

        case ModalConstants.SIGNUP:
            signup();
            ModalStore.emitChange();
            break;

        case ModalConstants.ACTIVATION:
            activation(action.netid);
            ModalStore.emitChange();
            break;

        case ModalConstants.ACCOUNT:
            account();
            ModalStore.emitChange();
            break;

        case ModalConstants.ENROLLMENT:
            enrollment();
            ModalStore.emitChange();
            break;

        case ModalConstants.SEND_SCHEDULE:
            sendSchedule();
            ModalStore.emitChange();
            break;

        case ModalConstants.ADD_SCHEDULE:
            addSchedule(action.schedule);
            ModalStore.emitChange();
            break;

        case ModalConstants.CATALOG:
            catalog(action.page);
            ModalStore.emitChange();
            break;

        case ModalConstants.CATALOG_BACK:
            catalogBack();
            ModalStore.emitChange();
            break;

        case ModalConstants.CATALOG_FORWARD:
            catalogForward();
            ModalStore.emitChange();
            break;

        case ModalConstants.CATALOG_RESET:
            catalogReset();
            ModalStore.emitChange();
            break;

        case ModalConstants.CLOSE:
            close();
            ModalStore.emitChange();
            break;

        default:
    }
});

module.exports = ModalStore;

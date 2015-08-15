/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Store to handle the logged in user object.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    UserConstants = require('../constants/UserConstants'),
    assign = require('object-assign'),
    moment = require('moment'),
    _ = require('underscore');

var CHANGE_EVENT = 'user_change';

var _user = false;

// Restore from render context on client side.
if (process.env.NODE_ENV === 'browserify') {
    restore(context.UserStore);
}

/**
 * Apply a user object as the logged in user.
 * @param {object} user User object to login.
 */
function login(user) {
    _user = user;
}

/**
 * Unapply the logged in user object.
 */
function logout() {
    _user = false;
}

/**
 * Generate a snapshot that can be converted to JSON and used by another
 * instance of the store to restore it back to an identical state.
 */
function snapshot() {
    return {
        _user: _user
    };
}

/**
 * Restore the state of the store from a snapshot.
 * @param {object} snapshot Snapshot to return state to.
 */
function restore(snapshot) {
    _user = snapshot._user;
}

var UserStore = assign({}, EventEmitter.prototype, {
    /**
     * Get the state of the user to render.
     * @return {object} State of the logged in user.
     */
    getUser: function() {
        return _user;
    },

    /**
     * Determine if an user is logged in.
     * @return {boolean} If a user is logged in.
     */
    isLoggedIn: function() {
        return  _user !== false;
    },

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

if (process.env.NODE_ENV !== 'browserify') {
    UserStore.reset = function(req) {
        var snapshot = {};

        if (req.isAuthenticated())
            snapshot._user = req.user.cleanOutput();
        else
            snapshot._user = false;

        restore(snapshot);
    };
}

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case UserConstants.LOGIN:
            login(action.user);
            UserStore.emitChange();
            break;

        case UserConstants.LOGOUT:
            logout();
            UserStore.emitChange();
            break;

        default:
    }
});

module.exports = UserStore;

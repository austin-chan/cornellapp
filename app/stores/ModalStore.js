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
    assign = require('object-assign'),
    moment = require('moment'),
    _ = require('underscore');

var CHANGE_EVENT = 'schedule_change';

var _active = false,
    _modalType,
    _modalData;

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
}

/**
 * Activate the catalog view.
 */
function catalog() {
    _active = 'catalog';
    _modalData = {};
}

/**
 * Deactivate all modals and catalog.
 */
function close() {
    _active = false;
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
            active: _active === 'catalog'
        };
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

        case ModalConstants.CATALOG:
            catalog(action.page);
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

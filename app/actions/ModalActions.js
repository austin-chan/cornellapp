/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Describes all actions related to modal components that render on top of the
 * window.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ModalConstants = require('../constants/ModalConstants');

var ModalActions = {
    /**
     * Activate the login modal to appear.
     */
    login: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.LOGIN
        });
    },

    /**
     * Activate the signup modal to appear.
     */
    signup: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.SIGNUP
        });
    },

    /**
     * Activate the account activation modal to appear.
     * @param {string} netid Netid of account waiting to be activated.
     */
    activation: function(netid) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.ACTIVATION,
            netid: netid
        });
    },

    /**
     * Activate the account view panel.
     */
    account: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.ACCOUNT
        });
    },

    /**
     * Open the course catalog.
     * @param {object} course Optional course object to open to.
     */
    catalog: function(course) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            course: course
        });
    },

    /**
     * Close any open modals or catalog.
     */
    close: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CLOSE
        });
    },
};

module.exports = ModalActions;

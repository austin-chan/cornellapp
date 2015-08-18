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
     * Activate the enrollment info view panel.
     */
    enrollment: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.ENROLLMENT
        });
    },

    /**
     * Open the course catalog and optionally load a certain page.
     * @param {string} page Optional link to load in the catalog.
     */
    catalog: function(page) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: page
        });
    },

    /**
     * Open the course catalog to a certain course's page.
     * @param {string} course Course object to load page for.
     */
    catalogCourse: function() {
        ModalActions.catalog('/course');
    },

    /**
     * Load the catalog next page.
     */
    catalogBack: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG_BACK
        });
    },

    /**
     * Load the catalog previous page.
     */
    catalogForward: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG_FORWARD
        });
    },

    /**
     * Reset the catalog to the default page and clear all history.
     */
    catalogReset: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG_RESET
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

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
    ScheduleStore = require('../stores/ScheduleStore'),
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
     * Open the course catalog.
     */
    catalog: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: false
        });
    },

    /**
     * Open the course catalog and display all of the subjects available.
     */
    catalogSubjects: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'subjects',
                title: 'All Subjects'
            }
        });
    },

    /**
     * Open the course catalog and display all of the courses for a subject.
     * @param {string} subject Subject string to display courses for.
     */
    catalogSubject: function(subject) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'subject',
                title: ScheduleStore.getSubjectName(subject),
                subject: subject
            }
        });
    },

    /**
     * Open the course catalog to a certain course's page.
     * @param {string} subject Subject slug of the course.
     * @param {number} number Catalog number of the course.
     */
    catalogCourse: function(subject, number) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'course',
                title: subject + ' ' + number,
                subject: subject,
                number: number
            }
        });
    },

    /**
     * Open the course catalog to the most liked courses page.
     */
    catalogMostLiked: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'most-liked',
                title: 'Most Liked'
            }
        });
    },

    /**
     * Open the course catalog to the random courses page.
     */
    catalogRandom: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'random',
                title: 'Random Courses'
            }
        });
    },

    /**
     * Open the course catalog to a search page.
     * @param {string} term Search term to search courses with.
     */
    catalogSearch: function(term) {
        AppDispatcher.dispatch({
            actionType: ModalConstants.CATALOG,
            page: {
                type: 'search',
                title: term,
                term: term
            }
        });
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

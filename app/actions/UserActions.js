/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Describes all actions related to the logged in user.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    UserConstants = require('../constants/UserConstants');

var UserActions = {
    /**
     * Apply a user object as the logged in user.
     * @param {object} user User object to login.
     */
    login: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.LOGIN,
            user: user
        });
    },

    /**
     * Unapply the logged in user object.
     */
    logout: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.LOGOUT
        });
    }
};

module.exports = UserActions;

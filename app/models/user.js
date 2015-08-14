/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for user.
 */

var randomstring = require('randomstring'),
    bcrypt = require('bcrypt');

var user = function(bookshelf, models) {
    return bookshelf.Model.extend({
        tableName: 'users',
        correctHash: function(hash) {
            return bcrypt.compareSync(hash, this.get(password));
        }
    }, {
        /**
         * Generate a random string for identification for unactivated users to
         * activate their account using the activation key.
         * @return {string} Random activation key of length 32.
         */
        generateActivationKey: function() {
            return randomstring.generate();
        },

        /**
         * Generate a password hash for a password.
         * @return {string} Password hash.
         */
        hashPassword: function(password) {
            return bcrypt.hashSync(password, 8);
        }
    });
};

module.exports = user;

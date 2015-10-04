/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for a schedule.
 */

 var schedule = function(bookshelf, models) {
    return bookshelf.Model.extend({
        tableName: 'schedules',
    }, {
        /**
         * Generate a random string for a schedule id.
         * @return {string} Random string for the id.
         */
        generateId: function() {
            return (Math.floor(Math.random() * 100000000000)).toString(36);
        }
    });
};

module.exports = schedule;

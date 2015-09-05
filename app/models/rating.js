/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for course difficulty ratings.
 */

var rating = function(bookshelf, models) {
    return bookshelf.Model.extend({
        tableName: 'ratings',
    });
};

module.exports = rating;

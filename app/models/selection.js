/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for selection.
 */

var selection = function(bookshelf, models) {
    return bookshelf.Model.extend({
        tableName: 'selections',
        idAttribute: 'tag',
        course: function() {
            return this.hasOne(models.course, 'crseId_strm_subject');
        },
    });
};

module.exports = selection;

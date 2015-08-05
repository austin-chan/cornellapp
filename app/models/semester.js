/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for semesters.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'semesters',
		courses: function() {
			var relation = this.hasMany(models.course, 'strm');
			relation.relatedData.parentTableName = 'strm';
			return relation;
		}
	});
}

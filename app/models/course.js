/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for courses.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'courses',
		semester: function() {
			var relation = this.belongsTo(models.semester, 'strm');
			relation.relatedData.parentTableName = 'strm';
			return relation;
		},
		groups: function() {
			return this.hasMany(models.group, 'courseId');
		}
	});
}

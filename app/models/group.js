/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for enroll groups.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'groups',
		course: function() {
			var relation = this.belongsTo(models.course);
			relation.relatedData.parentTableName = 'courseId';
			return relation;
		},
		sections: function() {
			return this.hasMany(models.section, 'groupId');
		}
	});
}

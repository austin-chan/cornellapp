/**
 * @fileoverview The model class for enroll groups.
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

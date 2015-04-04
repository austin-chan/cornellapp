/**
 * @fileoverview The model class for enroll groups.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'groups',
		course: function() {
			var related = this.belongsTo(models.course);
			relation.relatedData.parentTableName = 'courseId';
			return related;
		},
		sections: function() {
			return this.hasMany(models.section, 'groupId');
		}
	});
}

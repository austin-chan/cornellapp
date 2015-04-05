/**
 * @fileoverview The model class for class sections.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'sections',
		group: function() {
			var relation = this.belongsTo(models.group);
			relation.relatedData.parentTableName = 'groupId';
			return relation;
		},
		meetings: function() {
			return this.hasMany(models.meeting, 'sectionId');
		}
	});
}

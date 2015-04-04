/**
 * @fileoverview The model class for class sections.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'sections',
		group: function() {
			var related = this.belongsTo(models.group);
			relation.relatedData.parentTableName = 'groupId';
			return related;
		},
		meetings: function() {
			return this.hasMany(models.meeting, 'sectionId');
		}
	});
}

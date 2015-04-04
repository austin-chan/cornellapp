/**
 * @fileoverview The model class for meetings.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'meetings',
		section: function() {
			var related = this.belongsTo(models.section);
			relation.relatedData.parentTableName = 'sectionId';
			return related;
		}
	});
}

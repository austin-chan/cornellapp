/**
 * @fileoverview The model class for courses.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'courses',
		semester: function() {
			var related = this.belongsTo(models.semester, 'strm');
			relation.relatedData.parentTableName = 'strm';
			return related;
		}
	});
}

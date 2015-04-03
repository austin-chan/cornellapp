/**
 * @fileoverview The model class for semesters.
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

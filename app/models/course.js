/**
 * @fileoverview The model class for courses.
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

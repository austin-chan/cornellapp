/**
 * @fileoverview The model class for meetings.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'meetings',
		section: function() {
			var relation = this.belongsTo(models.section);
			relation.relatedData.parentTableName = 'sectionId';
			return relation;
		},
		professors: function() {
			var relation = this.hasMany(models.professor, 'meetingId')
				.through(models.meetingprofessorsjoin, 'id', 'meetingId');
			relation.relatedData.throughIdAttribute = 'professorNetid';
			relation.relatedData.throughForeignKey = 'netid';
			return relation;
		}
	});
}

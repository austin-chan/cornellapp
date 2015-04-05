/**
 * @fileoverview The model class for meeting-professors joins.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'meeting_professors_joins'
	});
}

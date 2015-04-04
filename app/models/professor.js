/**
 * @fileoverview The model class for professors.
 */

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'professors'
	});
}

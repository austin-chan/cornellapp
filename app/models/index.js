/**
 * @fileoverview Entrypoint for accessing all of the models. Require this file
 * with the bookshelf object as an argument to initialize all of the models
 */

module.exports = function(bookshelf) {
	var m = {};

	m.semester = require('./semester.js')(bookshelf, m);
	m.course = require('./courses.js')(bookshelf, m);

	return m;
}


  // targetTableName: 'courses',
  // targetIdAttribute: 'id',
  // foreignKey: undefined,
  // parentId: undefined,
  // parentTableName: 'semesters',
  // parentIdAttribute: 'id',
  // parentFk: undefined }
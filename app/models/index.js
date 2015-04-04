/**
 * @fileoverview Entrypoint for accessing all of the models. Require this file
 * with the bookshelf object as an argument to initialize all of the models
 */

module.exports = function(bookshelf) {
	var m = {};

	m.semester = require('./semester.js')(bookshelf, m);
	m.course = require('./course.js')(bookshelf, m);
	m.group = require('./group.js')(bookshelf, m);
	m.section = require('./section.js')(bookshelf, m);
	m.meeting = require('./meeting.js')(bookshelf, m);
	m.professor = require('./professor.js')(bookshelf, m);

	return m;
}

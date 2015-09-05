/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The entrypoint for accessing all of the models. Require this file with the
 * bookshelf object as an argument to initialize all of the models.
 */

var m = {};

var models = function(bookshelf) {
	m.knex = bookshelf.knex;
	m.user = require('./user.js')(bookshelf, m);
	m.selection = require('./selection.js')(bookshelf, m);
	m.event = require('./event.js')(bookshelf, m);
	m.comment = require('./comment.js')(bookshelf, m);
	m.upvote = require('./upvote.js')(bookshelf, m);
	m.rating = require('./rating.js')(bookshelf, m);
	m.semester = require('./semester.js')(bookshelf, m);
	m.course = require('./course.js')(bookshelf, m);
	m.group = require('./group.js')(bookshelf, m);
	m.section = require('./section.js')(bookshelf, m);
	m.meeting = require('./meeting.js')(bookshelf, m);
	m.meetingprofessorsjoin =
		require('./meetingprofessorsjoin.js')(bookshelf, m);
	m.professor = require('./professor.js')(bookshelf, m);

	return m;
};

module.exports = models;

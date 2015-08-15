/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling all api routes.
 */

var strutil = require('../utils/strutil'),
	cornellutil = require('../utils/cornellutil');

var apirouter = function(app, blockValidationErrors) {
	var knex = app.get('knex'),
		models = app.get('models'),
		apiutil = require('../utils/apiutil')(models);

	// Route for searching for courses to add.
	app.get('/api/search/courses', function(req, res) {
		req.sanitizeQuery('query').trim();
		req.checkQuery('strm', 'Provide a strm.').notEmpty().isInt();
		req.checkQuery('query', 'Provide a query.').notEmpty();

		blockValidationErrors(req, res, function() {
			apiutil.searchCourses(req.query, 10, function(err, courses) {
				if (err) {
					res.status(400);
					res.send('An error occurred performing the course search.');
					return;
				}

				res.send(courses);
			});
		});
	});

	// Route for getting a full name for a netid
	app.get('/api/fetch-name', function(req, res) {
		req.checkQuery('netid', 'Provide a netid.').notEmpty();

		blockValidationErrors(req, res, function() {
			cornellutil.fetchName(req.query.netid, function(name) {
				if (name === null)
					name = '';

				res.send(name);
			});
		});
	});

    require('./authenticationrouter')(app, blockValidationErrors);
    require('./selectionrouter')(app, blockValidationErrors);
};

module.exports = apirouter;

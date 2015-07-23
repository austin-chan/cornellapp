/**
 * @fileoverview This file is the main route declaration file for the Chequerd
 * application. This file uses submodule routers to handle subroutes.
 */

var app = module.exports = require('../server');

app.get('/', function(req, res) {
	var config = app.get('config'),
		configutil = require('./utils/configutil')(config);

	res.render('index', {
		"config": config,
		"configutil": configutil
	});
});

// "/api"
require('./routers/apirouter');
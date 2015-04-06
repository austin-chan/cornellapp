/**
 * @fileoverview This file is the main route declaration file for the Chequerd
 * application. This file uses submodule routers to handle subroutes.
 */

var app = module.exports = require('../server');

app.get('/', function(req, res) {
	res.render('index');
});

// "/api"
require('./routers/apirouter');
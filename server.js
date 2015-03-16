/**
 * @fileoverview Main entrypoint for the Chequerd application. This file begins
 * the initialization process for the main application files and all their
 * dependencies.
 */


// Initialize express and all top-level packages.
var express = require('express'),
	app = module.exports = express(),
	port = process.env.PORT || 3000,
	bodyParser = require('body-parser'),
	config = require('config'),
	knex = require('knex')(config.knex),
	bookshelf = require('bookshelf')(knex),
	_ = app.set('bookshelf', bookshelf),
	models = require('./app/models');


// App configuration.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// app.set('view engine', 'ejs');



// Declare all site routes.
require('./app/routes')


// Start server!
app.listen(port);
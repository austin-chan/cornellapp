/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Entry point for the Cornellapp web server. This file begins the
 * initialization process for the application files and all the dependencies.
 */

// Initialize environment variables for local environment. The dotenv package
// is not included in package.json, every local installation must set up the
// environment variables independently.
if (require("fs").existsSync('.env'))
    require('dotenv').load();
else
    require('dotenv').config({ path: '.productionenv' });

// Initialize express and all top-level packages.
var express = require('express'),
    app = module.exports = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    passport = require('passport'),
    config = require('./config'),
    knex = require('knex')(config.knex),
    bookshelf = require('bookshelf')(knex),
    models = require('./app/models')(bookshelf),
    KnexSessionStore = require('connect-session-knex')(session),
    sessionStore = new KnexSessionStore({ knex: knex });

// App configuration.
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.set('models', models);
app.set('knex', knex);
app.set('passport', passport);
app.set('authorize', require('./app/initialization/authorize'));
app.set('config', config);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'kCornellapp', saveUninitialized: false,
    resave: false, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({ customValidators: {
    isArray: function(value) { return Array.isArray(value); }
}}));
app.use(express.static(__dirname + '/public'));

// Initialize authentication.
require('./app/initialization/authentication')(passport, models);

// Include the JSX compiler.
require("node-jsx").install({ extension: '.jsx' });

// Declare all site routes.
require('./app/routes')(app);

// Handle 404 error.
app.get('*', function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
});

// Start server!
app.listen(port);
console.log(require('chalk').green('Server started at port ' + port));

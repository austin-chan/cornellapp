/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Knex module's config file. Config for the whole application
 * is abstracted into the config module, but since this file is required by
 * knex, the database config values are just copied below from the config
 * module.
 */

var fs = require("fs");

// Initialize environment variables for local environment.
var exists = fs.existsSync('.env');
if (exists)
    require('dotenv').load();
else
    require('dotenv').config({ path: '.productionenv' });

var knexConfig = {
    development: require('./config').knex,
    production: require('./config').knex
};

module.exports = knexConfig;

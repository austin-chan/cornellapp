/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Performs the operation of retrieving, storing and updating all course data
 * from the Cornell University Courses API. This file is named after the Google
 * web crawler "Trawler". Run trawl in the command line with an argument of the
 * semester name to update: 'node trawl FA15'
 */

// Initialize environment variables for local environment.
try {
    require('dotenv').load();
} catch(e) {}

var chalk = require('chalk');

require('./app/utils/trawlutil')
	.trawl(process.argv[2], console.log, printSuccess, exit);

function exit() {
	process.exit(1);
}

function printSuccess(message) {
	console.log(message + chalk.green(' Success \u2713'));
}

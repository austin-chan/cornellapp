/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling routes for searching for courses.
 */

var app = module.exports = require('../routes');

app.route('/search/courses').get(function(req, res) {
	res.send('hi');
});

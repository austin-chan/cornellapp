/**
 * @fileoverview Router submodule for handling routes for searching for courses.
 */

var app = module.exports = require('../routes');

app.route('/search/courses').get(function(req, res) {
	res.send('hi');
});
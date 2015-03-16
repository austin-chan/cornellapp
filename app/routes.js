var app = module.exports = require('../server');

app.get('/', function(req, res) {
	res.send('hi');
});
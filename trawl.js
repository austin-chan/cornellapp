/**
 * @fileoverview Performs the operation of retrieving, storing and updating
 * all course data from the Cornell University Courses API. This file is named
 * after the internal name of Google's web crawler "Trawler". Run trawl in the
 * command line with an argument of the semester name to update:
 * 'node trawl FA15'
 */

var cornellutil = require('./app/utils/cornellutil'),
	semester = process.argv[2];

if (!semester || typeof semester != 'string') {
	console.log('Provide a semester to scrape as an argument.');
	process.exit(1);
}

semester = semester.toUpperCase();

cornellutil.isAvailableRoster(semester, function(available) {
	if (!available) {
		console.log('Provide a valid semester to scrape.');
		process.exit(1);		
	}

	cornellutil.getSubjects(semester, function(subjects) {
		console.log(subjects);
	});
});

// var fs = require('fs');
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

// var fs = require('fs');
// var obj;
// fs.readFile('file', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
// });
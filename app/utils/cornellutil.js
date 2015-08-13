/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Handles all operations related to accessing Cornell's data endpoints,
 * including course and netid user data.
 */

var strutil = require('./strutil'),
	http = require('http'),
	https = require('https'),
	vcardparser = require('vcardparser'),
	m = {};

/**
 * The url base of the Cornell Courses API endpoints.
 * @type {string}
 */
m.apiBase = 'https://classes.cornell.edu/api/2.0/';

/**
 * Retrieve all available rosters from the Cornell Class Roster and returns the
 * information in a smaller object with the semesters' slugs, descriptions,
 * semester ID's and last-modified timestamps.
 * @param {function} callback Function that is called when the operation is
 *     finished with the first argument representing the result: an array of
 *     objects representing the available rosters by semester or null if an
 *     error occurred.
 */
m.getRosters = function(callback) {
	var rostersUrl = m.apiBase + 'config/rosters.json';
	httpGet(rostersUrl, true, function(data) {
		var rosters = JSON.parse(data).data.rosters;
		callback(rosters);

	}, function() {
		callback(null);
	});
};

/**
 * Retrieves the roster object for a semester by its semester slug. This
 * function determines it by retrieving all available rosters from the Cornell
 * Course Roster and verifying the availability of the roster from the data
 * returned from the API.
 * @param {string} semester String of semester slug to retrieve.
 * @param {function} callback Function that is called when the operation is
 *     finished with the first argument equaling the roster object from the
 *     Cornell Courses API or null otherwise.
 */
m.getRoster = function(semester, callback) {
	m.getRosters(function(rosters) {
		for (var i = 0; i < rosters.length; i++) {
			if (rosters[i].slug == semester) {
				callback(rosters[i]);
				return;
			}
		}
		callback(null);
	});
};

/**
 * Determines if a roster is availble by its semester slug. This is done by
 * retrieving all available rosters from the Cornell Course Roster and verifying
 * the availability of the roster from the data returned from the API. This
 * method is case-sensitive (e.g. fa15 does not equal FA15).
 * @param {string} semester String of semester slug to check the availability
 *     of.
 * @param {function} callback Function that is called when the operation is
 *     finished with the first argument equaling true if the roster slug is
 *     available or false otherwise.
 */
m.isAvailableRoster = function(semester, callback) {
	m.getRoster(semester, function(roster) {
		return roster !== null;
	});
};

/**
 * Returns a list of all subject tags for a given semester by its slug.
 * @param {string} semester String of a semester slug to check the available
 *     subjects from.
 * @param {function} callback Function that is called when the operation is
 *    finished with an array of subject tags or null if an error occurred.
 */
m.getSubjects = function(semester, callback) {
	var subjectsUrl = m.apiBase + 'config/subjects.json?roster=' + semester;
	httpGet(subjectsUrl, true, function(data) {
		var subjectData = JSON.parse(data).data.subjects,
			subjects = [];

		for (var i = 0; i < subjectData.length; i++) {
			var subject = subjectData[i];
			subjects.push(subject.value);
		}

		callback(subjects);
	}, function() {
		callback(null);
	});
};

/**
 * Retreives all class data for a subject during a semester. The return value is
 * an array of objects that is initialized from the JSON from the Cornell
 * Courses API.
 * @param {string} semester Semester slug string to retrieve course data for.
 * @param {string} subject Subject slug string to retrieve course data for.
 * @param {function} callback Function that is called when the operation is
 *     finished. The result array is passed as the first argument or null in the
 *     case of an error.
 */
m.getCourses = function(semester, subject, callback) {
	var coursesUrl = m.apiBase + 'search/classes.json?roster=' + semester +
		'&subject=' + subject;
	httpGet(coursesUrl, true, function(data) {
		var coursesData = JSON.parse(data).data.classes;

		callback(coursesData);
	}, function() {
		callback(null);
	});

};

/**
 * Retrieves the corresponding full name from a netid. If the netid does not
 * exist or no full name is found, null is returned. To facilitate the
 * retrieval of the appropriate data, a request to Cornell's People Search is
 * made. The permissibility of this action by the University is not certain, but
 * this is the only way in the absence of a People Search API. Will remove this
 * function only if we are contacted about it.
 * @param {string} netid The netid to retrieve a full name from.
 * @param {function} callback Function to call when the operation is finished
 *     with the first argument representing the result: the full name of the
 *     person associated with the netid or null if no person is associated.
 */
m.fetchName = function(netid, callback) {
	callback = callback || function(){};

	if (!netid.length || !strutil.isAlphanumeric(netid)) {
		callback(null);
		return;
	}

	var vcardUrl = 'http://www.cornell.edu/search/vcard.cfm?netid=' + netid;
	httpGet(vcardUrl, false, function(data) {
		vcardparser.parseString(data, function(err, json) {
		    if (err) {
		        callback(null);
		    }

		    callback(json.fn);
		});
	}, function() {
		callback(null);

	});
};

/**
 * Convenience function to perform an HTTP or HTTPS GET request.
 * @param {string} url Url to access.
 * @param {boolean} secure false to perform an HTTP request or true to perform
 *     an HTTPS request.
 * @param {function} success Callback function to run if the request was
 *     successful with the data string as the first parameter.
 * @param {function} fail Callback function to run if the request was
 *     unsuccessful or the data is empty.
 */
function httpGet(url, secure, success, fail) {
	var driver = secure ? https : http;

	driver.get(url, function(response) {
		var data = "";
		response.on("data", function(chunk) {
			data += chunk;

		}).on('end', function(){
			if (strutil.isWhiteEmpty(data)) {
				fail();
				return;
			}

			success(data);
	    });
	}).on('error', function(e) {
		fail();
	});
}

module.exports = m;

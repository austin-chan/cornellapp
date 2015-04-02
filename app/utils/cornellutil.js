/**
 * @fileoverview Module to handle all operations related to accessing
 * Cornell's data endpoints, including course and netid user data.
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
m.apiBase = 'https://classes.cornell.edu/api/2.0/config/';

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
	var rostersUrl = m.apiBase + 'rosters.json';
	httpGet(rostersUrl, true, function(data) {
		var rosterInfo = [];
		var rosterData = JSON.parse(data).data.rosters;
		for (var i = 0; i < rosterData.length; i++) {
			var roster = rosterData[i];

			rosterInfo.push({
				'slug': roster.slug,
				'descr': roster.descr,
				'strm': roster.strm,
				'lastupdated': roster.lastModifiedDttm
			});
		}

		callback(rosterInfo);
	}, function() {
		callback(null);
	});
}

/**
 * Determines if a roster is availble by its semester slug. This is done by
 * retrieving all available rosters from the Cornell Class Roster and verifying
 * the availability of the roster from the data returned from the API. This
 * method is case-sensitive (e.g. fa15 does not equal FA15).
 * @param {string} semester String of a semester slug to check the availability
 *     of.
 * @param {function} callback Function that is called when the operation is
 *     finished with the first argument equaling true if the roster slug is
 *     available or false otherwise.
 */
m.isAvailableRoster = function(semester, callback) {
	var rosters = m.getRosters(function(rosters) {
		for (var i = 0; i < rosters.length; i++) {
			if (rosters[i].slug == semester) {
				callback(true);
				return;
			}
		}
		callback(false);
	});
}


/**
 * Returns a list of all subject tags for a given semester by its slug.
 * @param {string} semester String of a semester slug to check the available
 *     subjects from.
 * @param {function} callback Function that is called when the operation is
 *    finished with an array of subject tags or null if an error occurred.
 */
m.getSubjects = function(semester, callback) {
	var subjectsUrl = m.apiBase + 'subjects.json?roster=' + semester;
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
}

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

		    callback(json['fn']);
		});
	}, function() {
		callback(null);
	});
}

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

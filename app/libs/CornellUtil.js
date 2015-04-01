/**
 * @fileoverview Module to handle all operations related to accessing
 * Cornell's data endpoints, including course and netid user data.
 */

var app = require('../../server'),
	strutil = require('./strutil'),
	http = require('http'),
	vcardparser = require('vcardparser'),
	m = {};

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

	if (!netid.length || !strutil.isAlphaumeric(netid)) {
		callback(null);
	}

	var endpoint = 'http://www.cornell.edu/search/vcard.cfm?netid=' + netid;
	http.get(endpoint, function(response) {
		var data = "";

		response.on("data", function(chunk) {
			data += chunk;
		});

		response.on('end', function(){
			if (strutil.isEmpty(data)) {
				callback(null)
			}

			vcardparser.parseString(data, function(err, json) {
			    if(err)
			        callback(null);

			    callback(json['fn']);
			})
	    });

	}).on('error', function(e) {
		callback(null);
	});
}

module.exports = m;
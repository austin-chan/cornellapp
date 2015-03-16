/**
 * @fileoverview Module to handle all operations related to accessing
 * Cornell's data endpoints, including course and netid user data.
 */

var app = require('../../server'),
	http = require('http'),
	vcard = require('vcard');

var m = {};

/**
 * Retrieves the corresponding full name from a netid. If the netid does not
 * exist or no full name is found, null is returned. To facilitate the
 * retrieval of the appropriate data, a request to Cornell's People Search is
 * made. The permissibility of this action by the University is not certain, but
 * this is the only way in the absence of a People Search API. Will remove this
 * function only if we are contacted about it.
 * @param {string} netid The netid to retrieve a full name from.
 * @return {string} The full name of the person associated with the netid or
 *     null if no person is associated.
 */
m.fetchName = function(netid) {

}

module.exports = m;
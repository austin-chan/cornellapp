/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Defines all reusable and commonly-useful helper functions related to strings.
 */

var m = {};

/**
 * Shortens a string to a specified maximum length, adding a specified number
 * of periods to suffix the shortened string. If the original string is larger
 * than the maximum length, the final shortened string including the periods
 * has a length of the maximum specified length.
 * @param {string} str String to shorten.
 * @param {number} len Maximum length of shortened string.
 * @param {number} dots Number of dots to use if the string needs to be
 *      shortened.
 * @return {string} Shortened string.
 */
m.shorten = function(str, len, dots) {
    dots = typeof dots !== 'undefined' ? dots : 3;

    var dotStr = Array(dots + 1).join('.');
    if(str.length > len - dots)
        str = str.substring(0, len - dots) + dotStr;

    return str;
}

/**
 * Determines if the input string only consists of numbers and letters, either
 * uppercase or lowercase. If the condition is true, or the string is empty,
 * returns true otherwise returns false.
 * @param {string} str The string to check the alphanumeric condition on.
 * @return {boolean} true if alphanumeric or empty. false otherwise.
 */
m.isAlphanumeric = function(str) {
	return /^[a-z0-9]+$/i.test(str) || str === '';
}

/**
 * Determines if a string is empty or only contains white-space.
 * @param {string} str The string to check the condition against.
 * @return {boolean} true if only white-space or empty. false otherwise.
 */
m.isWhiteEmpty = function(str) {
	return str.trim() === '';
}

/**
 * Get the first alphanumeric substring from a string. This function ignores
 * leading spaces and returns an empty string if the first non white-space
 * character is not a letter.
 * @param {string} str String to retrieve the substring from.
 * @return {string} First alphanumeric substring. An empty string if str is
 *     empty, contains only white-space or has a first non white-space character
 *     that is not a letter.
 */
m.firstAlphabeticSubstring = function(str) {
	var match = str.trim().match(/^[a-z]+/i);
	return match === null ? null : match[0];
}

/**
 * Get the first numeric substring from a string. This function ignores
 * leading spaces and non-numbers. This function is different from
 * firstAlphabeticSubstring in that it ignores non-numbers in front of the first
 * numeric substring. This function only returns the first four letters a
 * numeric substring as a maximum.
 * @param {string} str String to retrieve the substring from.
 * @return {string} First alphanumeric substring. An empty string if str is
 *     empty or contains only white-space.
 */
m.firstNumericSubstring = function(str) {
	var match = str.match(/[0-9]+/);
	return match === null ? null : match[0].substring(0, 4);
}

module.exports = m;

/**
 * @fileoverview Module for all reusable and commonly-useful helper functions
 * related to strings.
 */

var m = {};

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
	return str.trim() == '';
}

module.exports = m;
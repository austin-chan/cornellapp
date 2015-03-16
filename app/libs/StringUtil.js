/**
 * @fileoverview Module for all reusable and commonly-useful helper functions
 * related to strings.
 */

var m = {};

/**
 * Determines the condition that the input string only consists of numbers and
 * letters, either uppercase or lowercase. If the condition is true, or the
 * string is empty, returns true otherwise returns false.
 * @param {string} str The string to check the condition on.
 * @return {Boolean} true if alphanumeric or empty. false otherwise.
 */
m.isAlphaumeric = function(str) {
	return /^[a-z0-9]+$/i.test(str);
}

module.exports = m;
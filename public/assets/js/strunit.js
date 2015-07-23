/**
 * @fileoverview Helper object for string-related functions used by the
 * frontend.
 */

(function() {
	var m = {};

	/**
	 * Shorten a string by character count and optionally append three dots
	 * to the end of the truncated string. The truncated string with dots
	 * appended still follows the string length.
	 * @param {string} str String to truncate.
	 * @param {number} length Maximum length of the string.
	 * @param {boolean} appendDots Whether to append dots to the end of the
	 *     string.
	 * @return {string} String that is either unmodified or modified to fit
	 *     under the maximum length.
	 */
	m.stringCap = function(str, length, appendDots) {
		appendDots = appendDots || false;

		if (!str || length < 0) {
			return '';
		}

		if(str.length > length){
			return appendDots ? 
				str.substring(0, length - 3)+'...' :
				str.substring(0, length);
		}

		return str;
	}

	cq.strunit = m;

})();

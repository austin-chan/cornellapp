/**
 * @fileoverview Initialize global objects and site-wide data structures.
 */

(function() {
	/**
	 * The cq object is the only declaration in the whole global namespace.
	 * Pretty good javascript practice, am I right?
	 * @type {object}
	 */
	window.cq = {};

	/**
	 * cq.jst is the object containing all of the front-end javascript
	 * templates. It contains all templates in the public/assets/js-templates
	 * folder with the respective index of each template's filename. The second
	 * line is needed to clean up the side-effects of the grunt-contrib-jst
	 * module.
	 * @type {object}
	 */
	window.cq.jst = window.JST;
	delete window['JST'];

	/**
	 * cq.schedules is an object containing arrays of all the course selections
	 * at indeces specified by semester slugs.
	 * @type {array}
	 */
	window.cq.schedules = [];

	/**
	 * cq.semester is a string that specifies the active semester for the
	 * schedule in view. This string has a value of a semester slug.
	 * @type {String}
	 */
	window.cq.semester = {};
})();
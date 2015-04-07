/**
 * @fileoverview Initialize global objects and site-wide data structures.
 */

(function() {
	/**
	 * The cq object is the only declaration in the whole global namespace.
	 * Pretty good javascript form, am I right?
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
})();
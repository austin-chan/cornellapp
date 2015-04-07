/**
 * @fileoverview Initialize all custom components and attach event listeners
 * for them when the page loads.
 */

(function() {
	/**
	 * Initialize all custom toggles. When a toggle is clicked, it will switch
	 * state. The toggle class is 'cq-toggle'.
	 */
	$(document).on('click', '.cq-toggle', function() {
		var toggle = $(this).closest('.cq-toggle');

		toggle.toggleClass('off');
	});



// html2canvas($('.schedule-side')[0], {
//   onrendered: function(canvas) {
//     document.body.appendChild(canvas);
//   }
// });

})();
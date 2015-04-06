(function() {
	/**
	 * Initialize all custom toggles. When a toggle is clicked, it will switch
	 * state.
	 */
	$(document).on('click', '.cq-toggle', function() {
		var toggle = $(this).closest('.cq-toggle');

		toggle.toggleClass('off');
	});
})();
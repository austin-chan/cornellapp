/**
 * @fileoverview Initialize functionality for Chequerd front-end.
 */

(function() {
	var adderInput = $('.class-side .adder-input');
	adderInput.autocomplete({
		params: {
			semester: 'FA15'
		},
	    serviceUrl: '/api/search/courses',
	    onSelect: function (suggestion) {
	    	adderInput.val('').focus();
	    	console.log(suggestion.data);
	    },
	    // formatResult: function(suggestion, currentValue) {
	    // 	console.log('hi');
	    // },
	    transformResult: function(response, originalQuery) {
	        return {
	            suggestions: _.map(JSON.parse(response), function(course) {
	                return {
	                	value: course.subject + ' ' + course.catalogNbr + ': ' +
	                		course.titleLong,
	                	data: course
	                };
	            })
	        };
	    }
    });

	// $('.class-side .adder-input').on('keydown', function(e) {
	// 	var input = $(this),
	// 		suggestions = input.siblings('add-suggestions');

	// 	setTimeout($.proxy(function() {
	// 		var value = $.trim($(this).val()),
	// 			jqXHR = $(this).data('jqXHR');

	// 		if (!value) {
	// 			if (jqXHR && jqXHR.state() == 'pending') {
	// 				jqXHR.abort();
	// 			}


	// 		}
	// 	}, this), 0);
	// });
})();

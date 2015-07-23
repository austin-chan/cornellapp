/**
 * @fileoverview Initialize functionality for Chequerd front-end.
 */

(function() {
	var adderInput = $('.class-side .adder-input');
	adderInput.autocomplete({

		// Request parameters sent to the server
		params: {
			semester: function() {
				return cq.semester.strm;
			}
		},

		// Search request endpoint
	    serviceUrl: '/api/search/courses',

	    // Event fired on selection of a suggestion
	    onSelect: function (course) {
	    	adderInput.val('').focus();

	    	console.log(cq.courseunit);
	    	cq.courseunit.addCourse(course);
	    },

	    // Customize highlighting of suggestions
	    formatResult: function(suggestion, currentValue) {
	    	// Highlight 'CS3410' with no space
	    	var isLetter = true;
	    	for (var i = 0; i < currentValue.length && i < 6; i++) {
	    		if (isLetter && currentValue[i].match(/[a-z]/i)) {
	    			isLetter = false;
	    		} else {
	    			if (currentValue[i].match(/[0-9]/i)) {
	    				currentValue = currentValue.splice(i, 0, ' ');
	    			}
	    		}
	    	}

	    	var cleanTerm = suggestion.value,
		    		// .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
				htmlSafeString = cleanTerm
		            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
		            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        	currentValue = $.trim(currentValue).replace('  ', ' ')
        		.split(' ').join('|');

        	var regex = new RegExp('(' + currentValue + ')', 'gi');
			return htmlSafeString.replace(regex, '<strong>$1<\/strong>');
	    },

	    // Properly prepare data received from the server
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
})();

/**
 * @fileoverview Course control unit for managing frontend operations related
 * to courses.
 */

$(function() {
	var $classList = $('.class-list'),
		m = {};

	/**
	 * Add a course to the schedule by appending the rendered class info to the
	 * page, adding the course object to the models, and syncing with the
	 * server.
	 * @param {object} course Course object to add.
	 */
	m.addCourse = function(course) {
		var rendered = $(cq.jst['class-info']({
			"course": course.data
		}));

		console.log(course.data);

		$classList.prepend(rendered);
	}

	cq.courseunit = m;
});
/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalEnrollment renders inside of CAModal and displays enrollment
 * information about the selected courses. Component styles are located in
 * _CAModalEnrollment.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    classNames = require('classnames'),
    _ = require('underscore');

var CAModalEnrollment = React.createClass({
    propTypes: {
        courses: React.PropTypes.array.isRequired,
    },

    render: function() {
        var classesInfo = [];

        // Loop through all selected courses.
        _.each(this.props.courses, function(course) {
            var selectedSections = ScheduleStore.getSelectedSections(
                    course.selection.key),
                sections = [];

            // Loop through all selected sections for each course.
            _.each(selectedSections, function(selectedSection) {
                sections.push(
                    <p key={selectedSection.section} className="section">
                        <span className="id">
                            {selectedSection.ssrComponent}&nbsp;
                            {selectedSection.section}:
                        </span>
                        <span className="number">
                            {selectedSection.classNbr}
                        </span>
                    </p>
                );
            });

            // Add a rendered object for each course.
            classesInfo.push(
                <div key={course.selection.key} className="course">
                    <p className="course-label">
                        {course.raw.subject} {course.raw.catalogNbr}:&nbsp;
                        {course.raw.titleLong}
                    </p>
                    {sections}
                </div>
            );
        });

        return (
            <div className="ca-modal-enrollment">
                <h3>Enrollment Class Numbers</h3>
                {classesInfo}
            </div>
        );
    }
});

module.exports = CAModalEnrollment;

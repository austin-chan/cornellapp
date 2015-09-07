/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogAdd is the component that renders an add course to schedule button
 * in the catalog. Component styles are located in _CACatalogAdd.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ScheduleActions = require('../actions/ScheduleActions'),
    classNames = require('classnames');

var CACatalogAdd = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    /**
     * Determine whether the course is already in the schedule.
     * @return {boolean} True if the course is in the schedule, false if not.
     */
    courseIfInSchedule: function() {
        return ScheduleStore.exists(this.props.course);
    },

    render: function() {
        var addedToCourses = this.courseIfInSchedule(),
            textLabel = addedToCourses ? 'Added to Schedule' :
                'Add to Schedule',
            rootClass = classNames('ca-catalog-button', 'button',
                { red: !addedToCourses },
                { added: addedToCourses });

        return (
            <div className={rootClass} onClick={this._onAddCourse}>
                {textLabel}
            </div>
        );
    },

    /**
     * Event handler for adding a course.
     */
    _onAddCourse: function() {
        // Add if the course is not in the schedule.
        if (!this.courseIfInSchedule())
            ScheduleActions.add(this.props.course);

        // Or remove it if is in the schedule.
        else
            ScheduleActions.removeCourse(this.props.course);
    }
});

module.exports = CACatalogAdd;

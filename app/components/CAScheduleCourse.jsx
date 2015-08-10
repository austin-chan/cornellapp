/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleCourse represents a rendering of a course section. Component styles
 * are located in _CAScheduleCourse.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    CAScheduleInstance = require('./CAScheduleInstance'),
    Draggable = require('react-draggable'),
    classNames = require('classnames'),
    _ = require('underscore');

var CAScheduleCourse = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired,
        hourHeight: React.PropTypes.number.isRequired,
        scheduleStartTime: React.PropTypes.string.isRequired,
        scheduleEndTime: React.PropTypes.string.isRequired,
        pixelsBetweenTimes: React.PropTypes.func.isRequired,
        dayMap: React.PropTypes.object.isRequired,
        dayOffsetMap: React.PropTypes.object.isRequired,
        onDragStart: React.PropTypes.func.isRequired,
        onDragEnd: React.PropTypes.func.isRequired
    },

    /**
     * The bounds objct to specify how far the instance can be dragged.
     * See https://github.com/mzabriskie/react-draggable#api.
     * @param {object} section The section object to generate drag bounds for.
     * @return {object} Bounds object for the section.
     */
    boundsForSection: function(section) {
        var meetings = section.meetings,
            instances = [],
            bounds = {
                left: -9999,
                top: -9999,
                right: 9999,
                bottom: 9999
            };

        // Loop through each meeting of the section.
        _.each(meetings, function(meeting, meetingIndex) {
            // Filter empty strings, handles TBA cases.
            var days = _.pick(meeting.pattern.split(/(?=[A-Z])/),
                _.identity);

            // Loop through each letter in the pattern of the meeting.
            _.each(days, function(day) {
                var horizontalMap = this.props.dayOffsetMap[day],
                    top = this.props.pixelsBetweenTimes(
                        this.props.scheduleStartTime, meeting.timeStart),
                    bottom = this.props.pixelsBetweenTimes(
                        this.props.scheduleEndTime, meeting.timeEnd);

                bounds.top = Math.max(top, bounds.top);
                bounds.left = Math.max(horizontalMap.left, bounds.left);
                bounds.right = Math.min(horizontalMap.right, bounds.right);
                bounds.bottom = Math.min(bottom, bounds.bottom);
            }, this);
        }, this);
        console.log(bounds);
        return bounds;
    },

    /**
     * Generate markup for a section.
     * @param {object} section Section object to render.
     */
    renderSection: function(section) {
        var meetings = section.meetings,
            instances = [];

        // Loop through each meeting of the section.
        _.each(meetings, function(meeting, meetingIndex) {
            // Filter empty strings, handles TBA cases.
            var days = _.pick(meeting.pattern.split(/(?=[A-Z])/),
                _.identity);

            // Loop through each letter in the pattern of the meeting.
            _.each(days, function(day) {
                instances.push(
                    <CAScheduleInstance key={meetingIndex + day}
                        course={this.props.course}
                        section={section}
                        meeting={meeting}
                        day={this.props.dayMap[day]}
                        hourHeight={this.props.hourHeight}
                        scheduleStartTime={this.props.scheduleStartTime}
                        pixelsBetweenTimes={this.props.pixelsBetweenTimes} />
                );
            }, this);
        }, this);

        return instances;
    },

    render: function() {
        var course = this.props.course,
            sections = ScheduleStore.getSelectedSections(course.selection.key),
            rootClass = classNames('ca-schedule-course', course.selection.color),
            sectionsArray = [];

        // Loop through each section of the course.
        _.each(sections, function(section) {
            var instances = this.renderSection(section);

            sectionsArray.push(
                <Draggable key={section.section}
                    ref={section.section}
                    zIndex={100}
                    bounds={this.boundsForSection(section)}
                    onStart={this._onStart.bind(null, course,
                        section.ssrComponent)}
                    onStop={this._onStop.bind(null, section.section)}>

                    <div className="schedule-section">
                        {instances}
                    </div>
                </Draggable>
            );
        }, this);

        return (
            <div className={rootClass} ref="root">
                {sectionsArray}
            </div>
        );
    },

    /**
     * Event handler for drag start.
     * @param {object} course Course object being dragged.
     * @param {string} sectionType Type of section being dragged.
     */
    _onStart: function(course, sectionType) {
        this.props.onDragStart(course, sectionType);
    },

    /**
     * Event handler for drag stop.
     * @param {string} refName Ref of the draggable element of the event.
     * @param {object} e Event object.
     * @param {object} ui UI information about the draggable.
     */
    _onStop: function(refName, e, ui) {
        this.props.onDragEnd(e, ui, this.refs[refName]);
    }
});

module.exports = CAScheduleCourse;

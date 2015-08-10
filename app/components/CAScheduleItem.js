/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleItem represents a rendering of a course section.
 * are located in _CAScheduleItem.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    Draggable = require('react-draggable'),
    classNames = require('classnames'),
    moment = require('moment'),
    _ = require('underscore');

var CAScheduleItem = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired,
        hourHeight: React.PropTypes.number.isRequired,
        scheduleStartTime: React.PropTypes.string.isRequired,
        scheduleEndTime: React.PropTypes.string.isRequired,
        dayMap: React.PropTypes.object.isRequired,
        dayOffsetMap: React.PropTypes.object.isRequired
    },

    /**
     * Create a moment object for a time string. The day for the moment object
     * is set to January 1, 2000. Example: "04:30PM".
     * @param {string} time String representation of a time of day.
     * @return {object} Moment object representation of the time.
     */
    momentForTime: function(time) {
        var splitTime = time.split(/[^0-9]/),
            isAfterNoon = time.toUpperCase().indexOf('PM') !== -1 &&
                time.substring(0, 2) !== '12';

        return moment(new Date(2000, 0, 1,
            parseInt(splitTime[0]) + 12 * isAfterNoon,
            parseInt(splitTime[1])));
    },

    /**
     * Format a time string to render as a label in the instance. Example:
     * "04:30PM" returns "4:30".
     * @param {string} time Time to format.
     * @return {string} Formatted time to render.
     */
    formatTime: function(time) {
        if (time[0] === '0')
            time = time.substring(1);

        return time.replace(/[^0-9:]+/, '');
    },

    /**
     * Calculate number of pixels between two times. "04:30PM" and "03:30PM"
     * returns one unit of this.props.hourHeight.
     * @param {string} endTime Later time.
     * @param {string} startTime Earlier time.
     * @return {number} Number of pixels that should be rendered between the
     *      two times.
     */
    pixelsBetweenTimes: function(endTime, startTime) {
        return this.props.hourHeight * this.momentForTime(endTime)
            .diff(this.momentForTime(startTime), 'hour', true);
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
                    top = this.pixelsBetweenTimes(this.props.scheduleStartTime,
                        meeting.timeStart),
                    bottom = this.pixelsBetweenTimes(this.props.scheduleEndTime,
                        meeting.timeEnd);

                bounds.top = Math.max(top, bounds.top);
                bounds.left = Math.max(horizontalMap.left, bounds.left);
                bounds.right = Math.min(horizontalMap.right, bounds.right);
                bounds.bottom = Math.min(bottom, bounds.bottom);
            }, this);
        }, this);

        return bounds;
    },

    /**
     * Generate markup for a single instance and add its ref value to
     * this.instanceRefs. An instance is a single meeting bubble. A section may
     * have several instances.
     * @param {string} key String to be used as the React key for the element.
     * @param {object} section Section of the instance.
     * @param {object} meeting Meeting object from which to render the instance.
     * @param {string} day Single character string that represents the day for
     *      the instance.
     * @return {object} React object to render for the instance.
     */
    renderInstance: function(key, section, meeting, day) {
        var course = this.props.course,
            instanceWrapClass = classNames('schedule-instance-wrap',
                this.props.dayMap[day]),
            heightAmount = this.pixelsBetweenTimes(meeting.timeEnd,
                meeting.timeStart),
            topAmount = this.pixelsBetweenTimes(meeting.timeStart,
                this.props.scheduleStartTime),
            instanceWrapstyle = {
                height: heightAmount + 'px',
                top: topAmount + 'px'
            },
            includeHr;

        // Instance is smaller than an hour.
        if (heightAmount < this.props.hourHeight) {
            instanceWrapClass += ' compact';
        }

        return (
            <div key={key} className={instanceWrapClass}
                style={instanceWrapstyle}>

                <div className="schedule-instance">
                    <div className="instance-wrap">
                        <p className="instance-headline">
                            {course.raw.subject} {course.raw.catalogNbr} -&nbsp;
                            {section.ssrComponent}
                        </p>
                        <p className="instance-location">
                            {meeting.facilityDescr}
                        </p>
                        <hr />
                        <p className="instance-time">
                            {this.formatTime(meeting.timeStart)} -&nbsp;
                            {this.formatTime(meeting.timeEnd)}
                        </p>
                    </div>
                </div>
            </div>
        );
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
                instances.push(this.renderInstance(meetingIndex + day,
                    section, meeting, day));
            }, this);
        }, this);

        return instances;
    },

    render: function() {
        var course = this.props.course,
            sections = ScheduleStore.getSelectedSections(course.selection.key),
            rootClass = classNames('ca-schedule-item', course.selection.color),
            sectionsArray = [];

        // Loop through each section of the course.
        _.each(sections, function(section) {
            var instances = this.renderSection(section);

            sectionsArray.push(
                <Draggable key={section.section}
                    bounds={this.boundsForSection(section)}>

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
    }
});

module.exports = CAScheduleItem;

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
    ScheduleStore = require('../stores/ScheduleStore');
    classNames = require('classnames'),
    moment = require('moment'),
    _ = require('underscore');

var CAScheduleItem = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired,
        hourHeight: React.PropTypes.number.isRequired,
        startTime: React.PropTypes.string.isRequired
    },

    /**
     * Create a moment object for a time string. The day for the moment object
     * is set to January 1, 2000. Example: "04:30PM".
     * @param {string} time String representation of a time of day.
     * @return {object} Moment object representation of the time.
     */
    momentForTime: function(time) {
        var splitTime = time.split(/[^0-9]/),
            isPM = time.toUpperCase().indexOf('PM') !== -1;

        return moment(new Date(2000, 0, 1,
            parseInt(splitTime[0]) + 12 * isPM,
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
     * Generate markup for a single instance. A section may have multiple
     * instances.
     * @param {string} key String to be used as the React key for the element.
     * @param {object} section Section of the instance.
     * @param {object} meeting Meeting object from which to render the instance.
     * @param {string} day Single character string that represents the day for
     *      the instance.
     * @return {object} React object to render for the instance.
     */
    renderInstance: function(key, section, meeting, day) {
        var course = this.props.course,
            dayMap = {
                M: 'monday',
                T: 'tuesday',
                W: 'wednesday',
                R: 'thursday',
                F: 'friday',
                S: 'saturday',
                Su: 'sunday'
            },
            instanceWrapClass = classNames('schedule-instance-wrap',
                dayMap[day]),
            heightAmount = this.props.hourHeight *
                this.momentForTime(meeting.timeEnd)
                .diff(this.momentForTime(meeting.timeStart), 'hour', true),
            topAmount = this.props.hourHeight *
                this.momentForTime(meeting.timeStart)
                .diff(this.momentForTime(this.props.startTime), 'hour', true),
            instanceWrapstyle = {
                height: heightAmount + 'px',
                top: topAmount + 'px'
            };

        // Instance is smaller than an hour.
        if (heightAmount < this.props.hourHeight) {
            instanceWrapClass += ' compact';

            return (
                <div key={key} className={instanceWrapClass}
                    style={instanceWrapstyle}>

                    <div className='schedule-instance'>
                        <p className="instance-headline">
                            {course.raw.subject} {course.raw.catalogNbr} -&nbsp;
                            {section.ssrComponent}
                        </p>
                        <p className="instance-location">
                            {meeting.facilityDescr}
                        </p>
                        <p className="instance-time">
                            {this.formatTime(meeting.timeStart)} -&nbsp;
                            {this.formatTime(meeting.timeEnd)}
                        </p>
                    </div>
                </div>
            );
        } else {
            instanceWrapClass += ' compact';
            return (
                <div key={key} className={instanceWrapClass}
                    style={instanceWrapstyle}>

                    <div className='schedule-instance'>
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
            );
            // return (
            //     <div key={key} className={instanceWrapClass}
            //         style={instanceWrapstyle}>

            //         <div className='schedule-instance'>
            //             <p className="instance-headline">
            //                 {course.raw.subject} {course.raw.catalogNbr}
            //             </p>
            //             <p className="instance-location">
            //                 {meeting.facilityDescr}
            //             </p>
            //             <hr />
            //             <p className="instance-section-type">
            //                 {section.ssrComponentLong}
            //             </p>
            //             <p className="instance-time">
            //                 {this.formatTime(meeting.timeStart)} -&nbsp;
            //                 {this.formatTime(meeting.timeEnd)}
            //             </p>
            //         </div>
            //     </div>
            // );
        }
    },

    render: function() {
        var course = this.props.course,
            sections = ScheduleStore.getSelectedSections(course.selection.key),
            rootClass = classNames('ca-schedule-item', course.selection.color),
            meetingsArray = [];

        // Loop through each section of the course.
        _.each(sections, function(section) {
            var meetings = section.meetings,
                instances = [];

            // Loop through each meeting of the section.
            _.each(meetings, function(meeting, meetingIndex) {
                var days = meeting.pattern.split(/(?=[A-Z])/);
                // Loop through each letter in the pattern of the meeting.
                _.each(days, function(day) {
                    instances.push(this.renderInstance(meetingIndex + day,
                        section, meeting, day));
                }, this);
            }, this);

            meetingsArray.push(
                <div key={section.section} className="schedule-meeting">
                    {instances}
                </div>
            );
        }, this);

        return (
            <div className={rootClass}>
                {meetingsArray}
            </div>
        );
    }
});

module.exports = CAScheduleItem;

/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleInstance represents a rendering of a singular course meeting.
 * are located in _CAScheduleInstance.scss.
 */

var React = require('react/addons'),
    classNames = require('classnames');

var CAScheduleInstance = React.createClass({
    propTypes: function() {
        return {
            course: React.PropTypes.object.isRequired,
            section: React.PropTypes.object.isRequired,
            meeting: React.PropTypes.object.isRequired,
            day: React.PropTypes.string.isRequired,
            hourHeight: React.PropTypes.number.isRequired,
            scheduleStartTime: React.PropTypes.string.isRequired,
            pixelsBetweenTimes: React.PropTypes.func.isRequired
        };
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

    render: function() {
        var course = this.props.course,
            section = this.props.section,
            meeting = this.props.meeting,
            heightAmount = this.props.pixelsBetweenTimes(meeting.timeEnd,
                meeting.timeStart),
            topAmount = this.props.pixelsBetweenTimes(meeting.timeStart,
                this.props.scheduleStartTime),
            rootClass = classNames('ca-schedule-instance', this.props.day, {
                compact: heightAmount < this.props.hourHeight
            }),
            instanceWrapstyle = {
                height: heightAmount + 'px',
                top: topAmount + 'px'
            },
            includeHr;

        return (
            <div className={rootClass}
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
    }
});

module.exports = CAScheduleInstance;

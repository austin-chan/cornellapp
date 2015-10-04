/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleInstance represents an instance, which is the rendering of a
 * single course meeting. Visually, an instance is just one block on the
 * schedule. Component styles are located in _CAScheduleInstance.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames');

var CAScheduleInstance = React.createClass({
    propTypes: function() {
        return {
            course: React.PropTypes.object.isRequired,
            large: React.PropTypes.bool.isRequired,
            section: React.PropTypes.object.isRequired,
            meeting: React.PropTypes.object.isRequired,
            conflicts: React.PropTypes.bool.isRequired,
            conflictRenderIndex: React.PropTypes.number.isRequired,
            day: React.PropTypes.string.isRequired,
            pixelsBetweenTimes: React.PropTypes.func.isRequired
        };
    },

    render: function() {
        var course = this.props.course,
            section = this.props.section,
            meeting = this.props.meeting,
            heightAmount = this.props.pixelsBetweenTimes(meeting.timeEnd,
                meeting.timeStart),
            topAmount = this.props.pixelsBetweenTimes(meeting.timeStart,
                ScheduleStore.startTime),
            rootClass = classNames('ca-schedule-instance', this.props.day, {
                // If instance is less than 1 hour long.
                compact: ScheduleStore.timeDifference(meeting.timeEnd,
                    meeting.timeStart) < 1,
                'conflict-of-2': this.props.conflicts,
                large: this.props.large
            }),
            instanceWrapstyle = {
                height: heightAmount + 'px',
                top: topAmount + 'px'
            },
            headline = course.raw.subject + ' ' + course.raw.catalogNbr,
            sectionHeadline = section.ssrComponent + ' ' + section.section,
            time = strutil.formatTime(meeting.timeStart) + ' - ' +
                strutil.formatTime(meeting.timeEnd),
            professor = meeting.professors.length ?
                meeting.professors[0].firstName + ' ' +
                meeting.professors[0].lastName : 'Staff',
            includeHr;

        if (this.props.conflicts) {
            rootClass += ' conflict-column-' + this.props.conflictRenderIndex;

            return (
                <div className={rootClass}
                    style={instanceWrapstyle}>

                    <div className="schedule-instance">
                        <div className="instance-wrap">
                            <p className="instance-headline">
                                {headline}
                            </p>
                            <p className="instance-section-headline">
                                {sectionHeadline}
                            </p>
                            <p className="instance-time">
                                {time}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={rootClass}
                style={instanceWrapstyle}>

                <div className="schedule-instance">
                    <div className="instance-wrap">
                        <p className="instance-headline">
                            {headline}
                        </p>
                        <p className="instance-section-headline">
                            {sectionHeadline}
                        </p>
                        <p className="instance-location">
                            {meeting.facilityDescr}
                        </p>
                        <hr />
                        <p className="instance-professor">
                            {professor}
                        </p>
                        <p className="instance-time">
                            {time}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CAScheduleInstance;

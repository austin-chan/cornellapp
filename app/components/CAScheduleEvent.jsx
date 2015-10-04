/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleEvent represents a rendering of an event. Component styles are
 * located in _CAScheduleEvent.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames'),
    _ = require('underscore');

var CAScheduleEvent = React.createClass({
    propTypes: {
        event: React.PropTypes.object.isRequired,
        large: React.PropTypes.bool.isRequired,
        conflictMap: React.PropTypes.array.isRequired,
        renderMap: React.PropTypes.array.isRequired,
        pixelsBetweenTimes: React.PropTypes.func.isRequired,
        dayOffsetMap: React.PropTypes.object.isRequired,
    },

    /**
     * Render instances for an event.
     * @param {string} day Day slug for the instance.
     * @return {object} Renderable object
     */
    renderEventInstance: function(day) {
        var event = this.props.event,
            meetingAdapter = {
                timeStart: event.startTime,
                timeEnd: event.endTime
            },
            conflictAnalysis = ScheduleStore.conflictAnalysis(
                this.props.conflictMap, this.props.renderMap, meetingAdapter,
                day),
            conflicts = conflictAnalysis[0],
            conflictRenderIndex = conflictAnalysis[1],
            heightAmount = this.props.pixelsBetweenTimes(event.endTime,
                event.startTime),
            topAmount = this.props.pixelsBetweenTimes(event.startTime,
                ScheduleStore.startTime),
            instanceClass = classNames('ca-schedule-instance',
                ScheduleStore.dayMap[day], {
                'conflict-of-2': conflicts,
                large: this.props.large
            }),
            instanceWrapstyle = {
                height: heightAmount + 'px',
                top: topAmount + 'px'
            },
            time = strutil.formatTime(event.startTime) + ' - ' +
                strutil.formatTime(event.endTime),
            location;

        if (conflicts)
            instanceClass += ' conflict-column-' + conflictRenderIndex;

        if (event.location.trim().length)
            location = (
                <p className="event-location">{event.location}</p>
            );

        return (
            <div className={instanceClass} key={day}
                style={instanceWrapstyle}>

                <div className="schedule-instance">
                    <div className="instance-wrap">
                        <p className="event-name">{event.name}</p>
                        {location}
                        <p className="event-time">{time}</p>
                    </div>
                </div>
            </div>
        );
    },

    render: function() {
        var event = this.props.event,
            selectedDays = ScheduleStore.daysFromPattern(event.pattern),
            eventInstances = [],
            rootClass = classNames('ca-schedule-event', event.color, {
                large: this.props.large
            });

        // Iterate through each selected day.
        _.each(selectedDays, function(day) {
            eventInstances.push(this.renderEventInstance(day));
        }, this);

        return (
            <div className={rootClass}>
                {eventInstances}
            </div>
        );
    }
});

module.exports = CAScheduleEvent;

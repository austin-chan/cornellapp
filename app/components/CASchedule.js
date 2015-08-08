/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CASchedule represents the schedule area of the application. Component styles
 * are located in _CASchedule.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    CAScheduleItem = require('./CAScheduleItem'),
    _ = require('underscore');

var CASchedule = React.createClass({
    propTypes: {
        courses: React.PropTypes.object.isRequired
    },

    renderHourLabels: function() {
        var hourLabels = [],
            iterator = 8;

        // Loop from 8am through 10pm to generate hour labels.
        for (var n = 0; n < 15; n++) {
            hourLabels.push(
                <div key={n} className="hour-label">{iterator}:00</div>);
            iterator = iterator == 12 ? 1 : iterator + 1;
        }
        return hourLabels;
    },

    renderDayLabels: function() {
        var dayLabels = [],
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Loop through the days to generate day labels.
        for (var n = 0; n < days.length; n++) {
            dayLabels.push(<div key={n} className="day-label">{days[n]}</div>);
        }
        return dayLabels;
    },

    renderScheduleRows: function() {
        var scheduleRows = [];

        // Loop through all schedule rows.
        for (var n = 0; n < 15; n++) {
            scheduleRows.push(
                <div key={n} className="schedule-row"></div>);
        }
        return scheduleRows;
    },

    render: function() {
        var hourLabels = this.renderHourLabels(),
            dayLabels = this.renderDayLabels(),
            scheduleRows = this.renderScheduleRows(),
            courses = this.props.courses,
            courseItems = [];

        // Loop through courses in order.
        var keys = ScheduleStore.getOrderedCourseKeys();
        _.each(keys, function(key) {
            courseItems.push(
                <CAScheduleItem key={key} course={courses[key]} />
            );
        });

        return (
            <div className="ca-schedule">
                <div className="left">
                    {hourLabels}
                </div>
                <div className="right">
                    <div className="day-labels">
                        {dayLabels}
                    </div>
                    <div className="schedule-area">
                        <div className="schedule-rows">
                            {scheduleRows}
                        </div>
                        <div className="courses-area">
                            {courseItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CASchedule;

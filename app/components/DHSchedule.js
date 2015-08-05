/**
 * DHSchedule.js
 * Davyhoy
 *
 * Created by Austin Chan on August 4, 2015.
 * Copyright (c) 2015, Davyhoy. All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 * @jsx React.DOM
 */

var React = require('react/addons');

/**
 * DHSchedule represents the schedule area of the application.
 *
 * Component styles are located in _DHSchedule.scss.
 */

module.exports = React.createClass({

    displayName: 'DHSchedule',

    render: function() {
        var hourLabels = [],
            dayLabels = [],
            calendarRows = [],
            iterator = 8
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Loop from 8am through 10pm to generate hour labels and calendar rows.
        for (var n = 0; n < 14; n++) {
            hourLabels.push(
                <div key={n} className="hour-label">{iterator}:00</div>);
            calendarRows.push(
                <div key={n} className="calendar-row"></div>);
            iterator = iterator == 12 ? 1 : iterator + 1;
        }

        // Loop through the days to generate day labels.
        for (var n = 0; n < days.length; n++) {
            dayLabels.push(<div key={n} className="day-label">{days[n]}</div>);
        }

        return (
            <div id="dh-schedule">
                <div className="left">
                    {hourLabels}
                </div>
                <div className="right">
                    <div className="day-labels">
                        {dayLabels}
                    </div>
                    <div className="schedule-area">
                        {calendarRows}
                    </div>
                </div>
            </div>
        );
    }
});

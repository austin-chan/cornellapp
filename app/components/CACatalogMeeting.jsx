/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogMeeting is the component that renders a course meeting for the
 * catalog. Component styles are located in _CACatalogMeeting.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    _ = require('underscore');

var CACatalogMeeting = React.createClass({
    propTypes: {
        group: React.PropTypes.object.isRequired,
        meeting: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        this.dayMap = {
            M: 'Mon',
            T: 'Tue',
            W: 'Wed',
            R: 'Thur',
            F: 'Fri',
            S: 'Sat',
            Su: 'Sun'
        };
    },

    /**
     * Format the time string for the meeting for the catalog view. Example:
     * 04:25PM to 4:25pm.
     * @param {string} time Time string of the meeting.
     */
    formatTime: function(time) {
        time = time.toLowerCase();
        // Skip if the time is empty.
        if (!time)
            return '';

        // Remove a leading zero.
        if (time[0] === '0')
            return time.substring(1);

        return time;
    },

    /**
     * Render the days that the meeting meets.
     * @return {object} Renderable object for the days of the meeting.
     */
    renderDays: function() {
        var meeting = this.props.meeting,
            days = ScheduleStore.daysFromPattern(meeting.pattern);

        // Translate the day slugs to the abbreviations.
        days = _.map(days, function(day) {
            return this.dayMap[day];
        }, this);

        // Output TBA if no pattern exists.
        days = days.length ? days.join(', ') : 'TBA';

        return (
            <div className="days">
                {days}
            </div>
        );
    },

    /**
     * Render the times that the meeting meets.
     * @return {object} Renderable object for the times of the meeting.
     */
    renderTime: function() {
        var meeting = this.props.meeting,
            group = this.props.group,
            time = null,
            dates = null;

        // Render the time of the meeting.
        if (meeting.timeStart) {
            time = this.formatTime(meeting.timeStart) + ' - ' +
                this.formatTime(meeting.timeEnd);
        }

        // If the group is a special session, render the dates.
        if (group.sessionCode != '1') {
            dates = (
                <span className="dates">
                    {group.sessionBeginDt} - {group.sessionEndDt}
                </span>
            );
        }

        return (
            <p className="time">
                {time}
                {dates}
            </p>
        );
    },

    /**
     * Render the location where the meeting meets or "To Be Assigned".
     * @return {object} Renderable object for the location of the meeting.
     */
    renderLocation: function() {
        var location = this.props.meeting.facilityDescr || 'To Be Assigned';

        return (
            <p className="location">
                {location}
            </p>
        );
    },

    /**
     * Render the professors for the meeting.
     * @return {object} Renderable object for the professors of the meeting.
     */
    renderProfessors: function() {
        var meeting = this.props.meeting,
            professors = meeting.professors;

        // Translate each professor name.
        professors = _.map(professors, function(p) {
            return p.firstName + ' ' +
                (p.middleName.length ? p.middleName + ' ' : '') +
                p.lastName;
        });

        return (
            <p className="professors">
                {professors}
            </p>
        );
    },

    render: function() {
        var days = this.renderDays(),
            time = this.renderTime(),
            location = this.renderLocation(),
            professors = this.renderProfessors();

        return (
            <div className="ca-catalog-meeting">
                <div className="second-column">
                    {days}
                </div>
                <div className="third-column">
                    {time}
                    {location}
                </div>
                <div className="fourth-column">
                    {professors}
                </div>
            </div>
        );
    }
});

module.exports = CACatalogMeeting;

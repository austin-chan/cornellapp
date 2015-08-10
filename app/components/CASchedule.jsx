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
 */

var React = require('react/addons'),
    CAScheduleItem = require('./CAScheduleItem'),
    _ = require('underscore');

var CASchedule = React.createClass({
    propTypes: {
        courses: React.PropTypes.array.isRequired,
        size: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            size: 'normal'
        };
    },

    getInitialState: function() {
        return {
            isDragging: false
        };
    },

    componentWillMount: function() {
        this.hourHeight = this.props.size === 'normal' ? 75 : 120;
        this.startTime = '08:00AM';
        this.endTime = '11:00PM';
        this.dayOffsetMap = {}; // will be overriden in componentDidMount
        this.dayMap = {
                M: 'monday',
                T: 'tuesday',
                W: 'wednesday',
                R: 'thursday',
                F: 'friday',
                S: 'saturday',
                Su: 'sunday'
            };
    },

    /**
     * Calculate the offsets for each day to create boundaries when dragging.
     */
    componentDidMount: function() {
        var $scheduleArea = $(React.findDOMNode(this.refs.scheduleArea)),
            $coursesArea = $(React.findDOMNode(this.refs.coursesArea)),
            $mockItem = $('<div></div>').addClass('ca-schedule-item'),
            $mockWrap = $('<div></div>').addClass('schedule-instance-wrap'),
            $mockInstance = $('<div></div>').addClass('schedule-instance');

        // Add a mock instance to the schedule.
        $coursesArea.append($mockItem.append($mockWrap.append($mockInstance)));

        var dayOffsetMap = JSON.parse(JSON.stringify(this.dayMap)),
            coursesAreaRight = $scheduleArea.offset().left +
                $scheduleArea.outerWidth();

        // Loop through each day.
        dayOffsetMap = _.mapObject(dayOffsetMap, function(day) {
            // Add day class.
            $mockWrap.addClass(day);

            var mockInstanceRight = $mockInstance.offset().left +
                $mockInstance.outerWidth(),
                dayOffset = {
                    // reversed diliberately, left should be a negative value
                    left: $scheduleArea.offset().left -
                        $mockInstance.offset().left,
                    right: coursesAreaRight - mockInstanceRight
                }

            // Remove the day class.
            $mockWrap.removeClass(day);

            return dayOffset;
        });

        // Remove mock item from schedule.
        $mockItem.remove();
        this.dayOffsetMap = dayOffsetMap;
    },

    /**
     * Generate labels for all of the hours of the schedule.
     * @return {object} Generated React markup for the hour labels.
     */
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

    /**
     * Generate seven labels for all of the days.
     * @return {object} Generated React markup for the day labels.
     */
    renderDayLabels: function() {
        var dayLabels = [],
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Loop through the days to generate day labels.
        for (var n = 0; n < days.length; n++) {
            dayLabels.push(<div key={n} className="day-label">{days[n]}</div>);
        }
        return dayLabels;
    },

    /**
     * Generate markup for all of the stripes of the schedule.
     * @return {object} Generated React markup for the schedule rows.
     */
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
        _.each(courses, function(course) {
            if (!course.selection.active)
                return;

            courseItems.push(
                <CAScheduleItem key={course.selection.key}
                    hourHeight={this.hourHeight}
                    scheduleStartTime={this.startTime}
                    scheduleEndTime={this.endTime}
                    course={course}
                    dayMap={this.dayMap}
                    dayOffsetMap={this.dayOffsetMap}
                    onDragEnd={this._onSectionDragEnd} />
            );
        }, this);

        var drag = this.state.isDragging ? 'yes' : '';

        return (
            <div className="ca-schedule">
                <div className="left">
                    {hourLabels}
                </div>
                <div className="right">
                    <div className="day-labels">
                        {dayLabels}
                    </div>
                    <div className="schedule-area" ref="scheduleArea">
                        <div className="schedule-rows">
                            {scheduleRows}
                        </div>
                        <div className="courses-area" ref="coursesArea">
                            {courseItems}
                            {drag}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _onSectionDragStart: function() {
        // this.s
    },

    /**
     * Event handler for when a child item's drag end handler is trigger.
     * @param {object} e Event object.
     * @param {object} ui UI information about the draggable.
     * @param {object} draggable The ref for the draggable element.
     */
    _onSectionDragEnd: function(e, ui, draggable) {
        var draggableNode = React.findDOMNode(draggable);

        // Reset the position to be prepared for velocity animation.
        $(draggableNode).css({
            transform: 'translate(0, 0)',
        }).velocity({
            translateX: ui.position.left,
            translateY: ui.position.top,
        }, 0);

        $(draggableNode).velocity({
            translateX: 0,
            translateY: 0,
        }, {
            duration: 560,
            easing: [108, 16],
            complete: function() {
                draggable.resetState();
            }
        });
    }
});

module.exports = CASchedule;

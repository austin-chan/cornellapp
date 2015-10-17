/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasketEvent represents an user-created event. Component styles are located
 * in _CABasketEvent.scss.
 *
 * "been puttin' on a show, it was a sell out event"
 */

var React = require('react/addons'),
    CAToggle = require('./CAToggle'),
    CAColorPanel = require('./CAColorPanel'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ScheduleActions = require('../actions/ScheduleActions'),
    strutil = require('../utils/strutil'),
    pluralize = require('pluralize'),
    classNames = require('classnames'),
    _ = require('underscore');

var CABasketEvent = React.createClass({
    propTypes: {
        event: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            colorSelecting: false
        };
    },

    /**
     * Render toggles for the days of the week.
     * @return {object} Renderable object containing all of the toggles.
     */
    renderDayToggles: function() {
        var event = this.props.event,
            dayToggles = [],
            allDays = _.keys(ScheduleStore.dayMap),
            selectedDays = ScheduleStore.daysFromPattern(event.pattern),
            dayLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

        // Iterate through all of the days of the week.
        _.each(dayLabels, function(dayLabel, i) {
            // Pattern representation of the day.
            var day = allDays[i],
                selected = _.contains(selectedDays, day);

            dayToggles.push(
                <div className="toggle-item" key={dayLabel}>
                    <p>{dayLabel}</p>
                    <CAToggle selected={selected}
                        onToggle={this._onDayToggle.bind(this, day)} />
                </div>
            );
        }, this);

        return (
            <div className="day-toggles">
                {dayToggles}
            </div>
        );
    },

    /**
     * Render the selects to change the start and end time and credit count.
     * @return {object} Renderable object containing all of the selects.
     */
    renderSelects: function() {
        var event = this.props.event,
            times = [],
            credits = [],
            increments = ScheduleStore.getAllIncrements();

        // Create option elements for each 5 min intervals in the schedule.
        _.each(increments, function(increment) {
            var formatted = strutil.formatTime(increment, true);
            times.push(
                <option key={increment} value={increment}>{formatted}</option>
            );
        });

        // Iterate through all credit possibilities.
        for (var c = 0; c <= 12; c += 0.5) {
            credits.push(
                <option key={c} value={c}>
                    {c} {pluralize('credits', c)}
                </option>
            );
        }

        return (
            <div className="selects">
                <div className="start-time select-wrap">
                    <p>Start Time</p>
                    <select className="freight-sans-pro"
                        value={event.startTime}
                        onChange={this._onTimeChange.bind(this, false)}>
                        {times}
                    </select>
                    <i className="icon-arrow_drop_down dropdown"></i>
                </div>
                <div className="end-time select-wrap">
                    <p>End Time</p>
                    <select className="freight-sans-pro"
                        value={event.endTime}
                        onChange={this._onTimeChange.bind(this, true)}>
                        {times}
                    </select>
                    <i className="icon-arrow_drop_down dropdown"></i>
                </div>
                <div className="credits select-wrap">
                    <p>Credits</p>
                    <select className="freight-sans-pro"
                        value={event.credits}
                        onChange={this._onCreditChange}>
                        {credits}
                    </select>
                    <i className="icon-arrow_drop_down dropdown"></i>
                </div>
            </div>
        );
    },

    /**
     * Render the location input to change the location of the event.
     * @return {object} Renderable object that represents the location of the
     *      event.
     */
    renderLocation: function() {
        var event = this.props.event;

        return (
            <div className="location">
                <input className="ca-clear-input" type="text"
                    defaultValue={event.location} ref="locationInput"
                    placeholder="Enter Location"
                    onKeyDown={this._onLocationDown}
                    onBlur={this._onLocationBlur} />
            </div>
        );
    },

    render: function() {
        var event = this.props.event,
            active = event.active,
            rootClass = classNames('ca-basket-item', 'ca-basket-event',
                event.color, { inactive: !active }),
            dayToggles = this.renderDayToggles(),
            selects = this.renderSelects(),
            location = this.renderLocation();

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <CAToggle selected={active} onToggle={this._onToggle} />
                    <div className="input-wrap">
                        <input defaultValue={event.name} ref="nameInput"
                            onKeyDown={this._onNameDown}
                            onBlur={this._onNameBlur} />
                    </div>
                    <div className="ca-close" onClick={this._onRemove}>
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">
                    {location}
                    {dayToggles}
                    {selects}
                    <div className="button-area">
                        <button className="ca-simple-button"
                            onClick={this._onColorSelecting.bind(this, true)}>
                            Change Color
                        </button>
                        <button className="ca-simple-button"
                            onClick={this._onEditName}>
                            Edit Event Name
                        </button>
                    </div>
                </div>
                <CAColorPanel selected={event.color}
                    active={this.state.colorSelecting}
                    onDone={this._onColorSelecting.bind(this, false)}
                    onColorChange={this._onColorChange} />
            </div>
        );
    },

    /**
     * Event handler for changing the credit count for an event.
     * @param {object} e Event object for the select change.
     */
    _onCreditChange: function(e) {
        var credits = e.target.value;
        ScheduleActions.selectCredits(this.props.event.key, credits);
    },

    /**
     * Event handler for changing the start or end time of the event.
     * @param {boolean} isEndTime True to change the end time, false to change
     *      the start time.
     * @param {object} e Event object for the select change.
     */
    _onTimeChange: function(isEndTime, e) {
        var time = e.target.value;
        ScheduleActions.changeEventTime(this.props.event.key, time, isEndTime);
    },

    /**
     * Event handler for releasing focus form the event location input.
     */
    _onLocationBlur: function() {
        var inputNode = React.findDOMNode(this.refs.locationInput),
            value = inputNode.value;

        ScheduleActions.changeEventLocation(this.props.event.key, value);
    },

    /**
     * Event handler for keying down on the event name input.
     */
    _onLocationDown: function(e) {
        var inputNode = React.findDOMNode(this.refs.locationInput);
        // Trigger the blur event to process the name change.
        if (e.key === 'Enter')
            inputNode.blur();
    },

    /**
     * Event handler for releasing focus form the event name input.
     */
    _onNameBlur: function(e) {
        var inputNode = React.findDOMNode(this.refs.nameInput),
            value = inputNode.value;

        // Reset the name if it was changed to an empty string.
        if (!value.trim().length)
            inputNode.value = this.props.event.name;
        else
            ScheduleActions.changeEventName(this.props.event.key, value);
    },

    /**
     * Event handler for keying down on the event name input.
     */
    _onNameDown: function(e) {
        var inputNode = React.findDOMNode(this.refs.nameInput);
        // Trigger the blur event to process the name change.
        if (e.key === 'Enter')
            inputNode.blur();
    },

    /**
     * Event handler for editing the name of the event.
     */
    _onEditName: function() {
        var inputNode = React.findDOMNode(this.refs.nameInput);
        inputNode.select();
    },

    /**
     * Event handler for toggling a day on and off for an event in the schedule.
     * @param {string} daySlug Slug of the day to toggle on or off.
     * @param {boolean} selected Select or deselect the day for the event.
     */
    _onDayToggle: function(daySlug, selected) {
        ScheduleActions.toggleEventDay(this.props.event.key, daySlug, selected);
    },

    /**
     * Event handler for toggling the event on and off to apply the event to
     * the schedule.
     * @param {boolean} selected Select or deselect the event.
     */
    _onToggle: function(selected) {
        ScheduleActions.toggle(this.props.event.key, selected);
    },

    /**
     * Event handler for clicking on the x button to remove the event.
     */
    _onRemove: function() {
        ScheduleActions.remove(this.props.event.key);
    },

    /**
     * Event handler for activating and deactivating the color panel.
     * @param {boolean} selecting True to activate the color panel, false to
     *      deactivate it.
     */
    _onColorSelecting: function(selecting) {
        this.setState({
            colorSelecting: selecting
        });
    },

    /**
     * Event handler for changing the course color.
     * @param {string} color Color to change course to.
     */
    _onColorChange: function(color) {
        ScheduleActions.setColor(this.props.event.key, color);
    }
});

module.exports = CABasketEvent;

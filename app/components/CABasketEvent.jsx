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
     * @return {array} Array of toggles for all of the days of the week.
     */
    renderDayToggles: function() {
        var event = this.props.event,
            dayToggles = [],
            dayValues = _.values(ScheduleStore.getDayMap()),
            days = _.pick(event.pattern.split(/(?=[A-Z])/), _.identity),
            dayLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

        // Iterate through all of the days of the week.
        _.each(dayLabels, function(dayLabel, i) {
            // Pattern representation of the day.
            var daySlug = dayValues[i],
                selected = _.contains(daySlug, days);

            dayToggles.push(
                <div className="toggle-item" key={dayLabel}>
                    <p>{dayLabel}</p>
                    <CAToggle selected={selected}
                        onToggle={this._onDayToggle.bind(this, daySlug)} />
                </div>
            );
        }, this);

        return dayToggles;
    },

    render: function() {
        var event = this.props.event,
            active = event.active,
            rootClass = classNames('ca-basket-item', 'ca-basket-event',
                event.color, { inactive: !active }),
            dayToggles = this.renderDayToggles();

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <CAToggle selected={active} onToggle={this._onToggle} />
                    <div className="input-wrap">
                        <input defaultValue={event.name} />
                    </div>
                    <div className="ca-close" onClick={this._onRemove}>
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">
                    <div className="day-toggles">
                        {dayToggles}
                    </div>
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
     * Event handler for toggling a day on and off for an event in the schedule.
     */
    _onDayToggle: function(daySlug) {
        // ScheduleActions.toggle(this.props.event.key, selected);
    },

    /**
     * Event handler for toggling the event on and off to apply the event to
     * the schedule.
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

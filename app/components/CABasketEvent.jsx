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
 */

var React = require('react/addons'),
    CAToggle = require('./CAToggle'),
    CAColorPanel = require('./CAColorPanel'),
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

    render: function() {
        var event = this.props.event,
            active = event.active,
            rootClass = classNames('ca-basket-item', event.color,
            { inactive: !active });

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <CAToggle selected={active} onToggle={this._onToggle} />
                    Event
                    <div className="ca-close" onClick={this._onRemove}>
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">

                </div>
                <CAColorPanel selected={event.color}
                    active={this.state.colorSelecting}
                    onDone={this._onColorSelecting.bind(this, false)}
                    onColorChange={this._onColorChange} />
            </div>
        );
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
        ScheduleActions.setColor(this.props.course.selection.key, color);
    }
});

module.exports = CABasketEvent;

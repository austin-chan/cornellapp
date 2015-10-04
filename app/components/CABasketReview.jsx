/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasketReview reviews schedule information. Component styles are located in
 * _CABasketReview.scss.
 */


var React = require('react/addons'),
    classNames = require('classnames'),
    pluralize = require('pluralize'),
    strutil = require('../utils/strutil'),
    ScheduleStore = require('../stores/ScheduleStore'),
    UserStore = require('../stores/UserStore'),
    ScheduleActions = require('../actions/ScheduleActions'),
    ModalActions = require('../actions/ModalActions'),
    _ = require('underscore');

var CABasketReview = React.createClass({
    propTypes: {
        entries: React.PropTypes.array.isRequired,
    },

    render: function() {
        var entryLength = 0,
            credits = 0;

        // Loop through all selected courses and events.
        _.each(this.props.entries, function(entry) {
            if (entry.raw) {
                // Skip if the course is not set to active.
                if (!entry.selection.active)
                    return;

                credits += parseFloat(entry.selection.credits);
                entryLength++;
            } else {
                if (!entry.active)
                    return;

                credits += parseFloat(entry.credits);
            }
        });


        return (
            <div className="ca-basket-review">
                <div className="top">
                    <p className="item courses">
                        <span className="primary">
                            {entryLength}
                        </span>
                        <span className="secondary">
                            {strutil.capitalize(
                                pluralize('courses', entryLength)
                            )}
                        </span>
                    </p>
                    <p className="item credits">
                        <span className="primary">
                            {credits}
                        </span>
                        <span className="secondary">
                            {credits == '1' ? 'Credit' : 'Credits'}
                        </span>
                    </p>
                </div>
                <div className="button-area">
                    <button className="ca-simple-button"
                        onClick={this._onAddEvent}>
                        Add Event
                    </button>
                    <button className="ca-simple-button"
                        onClick={this._onEnrollment}>
                        Enrollment Information
                    </button>
                    <button className="ca-simple-button"
                        onClick={this._onSendSchedule}>
                        Send Schedule
                    </button>
                </div>
            </div>
        );
    },

    /**
     * Event handler for clicking on enrollment information button.
     */
    _onAddEvent: function() {
        ScheduleActions.addEvent();
    },

    /**
     * Event handler for clicking on enrollment information button.
     */
    _onEnrollment: function() {
        ModalActions.enrollment();
    },

    /**
     * Event handler for clicking on share schedule button.
     */
    _onSendSchedule: function() {
        // Skip if not logged in.
        if (!UserStore.isLoggedIn())
            return UserStore.guestNotice('send a schedule');

        ModalActions.sendSchedule();
    }
});

module.exports = CABasketReview;

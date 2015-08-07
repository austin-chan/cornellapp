/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DAApp is the main component that contains all of the subcomponents in the
 * Davyapp application. Component styles are located in _DAApp.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DAHeader = require('./DAHeader'),
    DABasket = require('./DABasket'),
    DASchedule = require('./DASchedule'),
    ScheduleStore = require('../stores/ScheduleStore');

/**
 * Retrieve schedule data from ScheduleStore.
 */
function getAppState() {
    return {
        courses: ScheduleStore.getCourses(),
        semester: ScheduleStore.getSemester()
    };
}

var DAApp = React.createClass({
    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        ScheduleStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ScheduleStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    render: function() {
        return (
            <div id="da-app">
                <DAHeader />
                <div className="container">
                    <DABasket courses={this.state.courses}
                        semester={this.state.semester} />
                    <DASchedule />
                </div>
            </div>
        );
    }
});

module.exports = DAApp;

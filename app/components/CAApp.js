/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAApp is the main component that contains all of the subcomponents in the
 * Cornellapp application. Component styles are located in _CAApp.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    CAHeader = require('./CAHeader'),
    CABasket = require('./CABasket'),
    CASchedule = require('./CASchedule'),
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

var CAApp = React.createClass({
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
            <div id="ca-app">
                <CAHeader />
                <div className="container">
                    <CABasket courses={this.state.courses}
                        semester={this.state.semester} />
                    <CASchedule />
                </div>
            </div>
        );
    }
});

module.exports = CAApp;

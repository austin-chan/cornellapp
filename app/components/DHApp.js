/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DHApp is the main component that contains all of the subcomponents in the
 * Davyhoy application. Component styles are located in _DHApp.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DHHeader = require('./DHHeader'),
    DHBasket = require('./DHBasket'),
    DHSchedule = require('./DHSchedule'),
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

module.exports = React.createClass({
    displayName: 'DHApp',

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
        this.setState(getTodoState());
    },

    render: function() {
        return (
            <div id="dh-app">
                <DHHeader />
                <div className="container">
                    <DHBasket semester={this.state.semester} />
                    <DHSchedule />
                </div>
            </div>
        );
    }
});

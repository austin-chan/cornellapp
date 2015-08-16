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
 */

var React = require('react/addons'),
    CAHeader = require('./CAHeader'),
    CABasket = require('./CABasket'),
    CASchedule = require('./CASchedule'),
    CACatalog = require('./CACatalog'),
    CAModal = require('./CAModal'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ModalStore = require('../stores/ModalStore'),
    UserStore = require('../stores/UserStore'),
    _ = require('underscore');

/**
 * Retrieve schedule data from ScheduleStore.
 * @return {object} All app state data.
 */
function getAppState() {
    return {
        user: UserStore.getUser(),
        allCourses: ScheduleStore.getCourses(),
        semester: ScheduleStore.getSemester(),
        modal: ModalStore.getModalState(),
        catalog: ModalStore.getCatalogState()
    };
}

var CAApp = React.createClass({
    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        ScheduleStore.addChangeListener(this._onChange);
        ModalStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ScheduleStore.removeChangeListener(this._onChange);
        ModalStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    render: function() {
        return (
            <div id="ca-app">
                <CAHeader user={this.state.user} />
                <div className="container">
                    <div className="left">
                        <CABasket courses={this.state.allCourses}
                            semester={this.state.semester} />
                    </div>
                    <div className="right">
                        <CASchedule courses={this.state.allCourses} />
                    </div>
                </div>
                <CAModal active={this.state.modal.active}
                    type={this.state.modal.type} data={this.state.modal.data} />
                <CACatalog active={this.state.catalog.active}
                    page={this.state.catalog.page}
                    hasBack={this.state.catalog.hasBack}
                    hasForward={this.state.catalog.hasForward} />
            </div>
        );
    }
});

module.exports = CAApp;

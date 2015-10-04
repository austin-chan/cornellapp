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
        allEntries: ScheduleStore.getEntries(),
        activeSemester: ScheduleStore.getSemester(),
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
        this.stopScroll = false;

        ScheduleStore.removeChangeListener(this._onChange);
        ModalStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    /**
     * Make sure the body is not scrollable with a modal or catalog.
     */
    componentWillUpdate: function(nextProps, nextState) {
        var stopScroll = nextState.catalog.active || nextState.modal.active;

        if (this.stopScroll !== stopScroll)
            $(document.body).toggleClass('disable-scroll', stopScroll);

        this.stopScroll = stopScroll;

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
                        <CABasket entries={this.state.allEntries}
                            semester={this.state.activeSemester} />
                    </div>
                    <div className="right">
                        <CASchedule entries={this.state.allEntries} />
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

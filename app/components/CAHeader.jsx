/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAHeader is handles the site's header. Component styles are located in
 * _CAHeader.scss.
 */

var React = require('react/addons'),
    ScheduleActions = require('../actions/ScheduleActions'),
    ModalActions = require('../actions/ModalActions'),
    UserActions = require('../actions/UserActions'),
    ScheduleStore = require('../stores/ScheduleStore'),
    classNames = require('classnames'),
    _ = require('underscore');

var CAHeader = React.createClass({
    propTypes: {
        user: React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.object
            ])
    },

    render: function() {
        var accountButtons,
            semesterButtons = [],
            activeSemester = ScheduleStore.getSemester();

        if (this.props.user)
            accountButtons = (
                <div className="account-buttons">
                    <button className="ca-outline-button"
                        onClick={this._onAccount}>
                        {this.props.user.name}
                    </button>
                    <button className="ca-outline-button"
                        onClick={this._onLogout}>
                        Log Out
                    </button>
                    <button className="ca-outline-button"
                        onClick={this._onCatalog}>
                        Open Catalog
                    </button>
                </div>
            );
        else
            accountButtons = (
                <div className="account-buttons">
                    <button className="ca-outline-button"
                        onClick={this._onSignup}>
                        Sign Up
                    </button>
                    <button className="ca-outline-button"
                        onClick={this._onLogin}>
                        Log In
                    </button>
                    <button className="ca-outline-button"
                        onClick={this._onCatalog}>
                        Open Catalog
                    </button>
                </div>
            );


        _.each(ScheduleStore.getSemesters(), function(s){
            var className = classNames('ca-fill-button', {
                selected: s.slug === activeSemester.slug
            });

            semesterButtons.push(
                <button className={className} key={s.slug}
                    onClick={this._onSemesterChange.bind(null, s)}>
                    {s.descr}
                </button>
            );
        }, this);

        return (
            <header className="ca-header">
                <div className="container">
                    <div className="left">
                        <p className="logo museo-sans">Cornellapp</p>
                        {accountButtons}
                    </div>
                    <div className="right">
                        <div className="semester-buttons">
                            {semesterButtons}
                        </div>
                    </div>
                </div>
            </header>
        );
    },

    /**
     * Event handler for opening the catalog.
     */
    _onCatalog: function() {
        ModalActions.catalog();
    },

    /**
     * Event handler for changing the active semester.
     */
    _onSemesterChange: function(semester) {
        ScheduleActions.changeSemester(semester);
    },

    /**
     * Event handler for logging out of the application.
     */
    _onLogout: function() {
        $.ajax({
            type: 'post',
            url: '/api/logout'
        });

        UserActions.logout();
        ScheduleActions.clear();
    },

    /**
     * Event handler for clicking the account button.
     */
    _onAccount: function() {
        ModalActions.account();
    },

    /**
     * Event handler for clicking the log in button.
     */
    _onLogin: function() {
        ModalActions.login();
    },

    /**
     * Event handler for clicking the log in button.
     */
    _onSignup: function() {
        ModalActions.signup();
    }
});

module.exports = CAHeader;

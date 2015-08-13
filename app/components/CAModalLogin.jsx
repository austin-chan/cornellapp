/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalLogin renders inside of CAModal and represents the login view.
 * Component styles are located in _CAModalLogin.scss.
 */

var React = require('react/addons'),
    ModalActions = require('../actions/ModalActions');

var CAModalLogin = React.createClass({
    componentWillMount: function() {
        this.loading = false;
    },

    render: function() {
        return (
            <div className="ca-modal-login">
                <h3>Log in to Cornellapp</h3>
                <div className="input-group">
                    <input className="ca-clear-input" type="text"
                        placeholder="NetID" onKeyDown={this._onKeyDown} />
                    <input className="ca-clear-input" type="password"
                        placeholder="Password" onKeyDown={this._onKeyDown} />
                </div>
                <div className="button-group">
                    <button className="ca-red-button"
                        onClick={this._onLogin}
                        ref="loginButton">
                        <span className="label">Log In</span>
                        <div className="spin-loader">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </button>
                    <button className="ca-simple-button condensed"
                        onClick={this._onSignup}>
                        Or Sign Up Instead
                    </button>
                </div>
            </div>
        );
    },

    /**
     * Event handler for signing up instead.
     */
    _onSignup: function() {
        ModalActions.signup();
    },

    /**
     * Event handler for pressing down a key.
     */
    _onKeyDown: function(e) {
        if (e.key === 'Enter')
            this._onLogin();
    },

    /**
     * Event handler for attempting a log in.
     */
    _onLogin: function() {
        // Prevent double submitting.
        if (this.loading)
            return;

        var loginButton = React.findDOMNode(this.refs.loginButton);
        $(loginButton).addClass('loading');

        this.loading = true;
    }
});

module.exports = CAModalLogin;

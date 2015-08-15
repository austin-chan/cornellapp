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
    ModalActions = require('../actions/ModalActions'),
    UserActions = require('../actions/UserActions'),
    classNames = require('classnames');

var CAModalLogin = React.createClass({
    getInitialState: function() {
        return {
            loading: false,
            errorMessage: ''
        };
    },

    /**
     * Autofocus the first input on mount.
     */
    componentDidMount: function() {
        var netidField = React.findDOMNode(this.refs.netidField);

        setTimeout(function() {
            netidField.focus();
        }, 50);
    },

    /**
     * Abort any pending requests.
     */
    componentWillUnmount: function() {
        if (this.jqXHR && this.jqXHR.readyState !== 4)
            this.jqXHR.abort();
    },

    /**
     * Render an error message.
     * @param {string} error Error message to display.
     */
    displayErrorMessage: function(errorMessage) {
        this.setState({
            errorMessage: errorMessage
        });
    },

    /**
     * Receive and parse the response from an attempt to login.
     * @param {object} data Response data for the login attempt.
     */
    receiveLoginResponse: function(data) {
        this.setState({
            loading: false
        });

        if (data.error)
            return this.displayErrorMessage(data.error);

        if (!data.user.active)
            return ModalActions.activate();

        UserActions.login(data.user);
        ModalActions.close();
    },

    render: function() {
        var errorMessage,
            submitButtonClass = classNames('ca-red-button', {
                loading: this.state.loading
            });

        if (this.state.errorMessage)
            errorMessage = (
                <p className="error-message">
                    {this.state.errorMessage}
                </p>
            );

        return (
            <div className="ca-modal-login">
                <h3>Log in to Cornellapp</h3>
                <form ref="form" onSubmit={this._onLogin}>
                    <div className="input-group">
                        <input className="ca-clear-input" type="text"
                            ref="netidField" name="netid" placeholder="NetID"
                            onKeyDown={this._onKeyDown} required />
                        <input className="ca-clear-input" type="password"
                            name="password" placeholder="Password"
                            onKeyDown={this._onKeyDown} required />
                    </div>
                    {errorMessage}
                    <div className="button-group">
                        <button className={submitButtonClass}
                            ref="submit" type="Submit">
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
                </form>
            </div>
        );
    },

    /**
     * Event handler for signing up instead.
     * @param {object} e Event object.
     */
    _onSignup: function(e) {
        e.preventDefault();
        ModalActions.signup();
    },

    /**
     * Event handler for pressing down a key.
     */
    _onKeyDown: function(e) {
        if (e.key === 'Enter')
            React.findDOMNode(this.refs.submit).click();
    },

    /**
     * Event handler for submitting the log in form.
     */
    _onLogin: function(e) {
        e.preventDefault();

        // Prevent double submitting.
        if (this.state.loading)
            return;

        var form = React.findDOMNode(this.refs.form);

        this.jqXHR = $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(form).serializeObject(),
            success: this.receiveLoginResponse
        });

        this.setState({
            loading: true
        });
    }
});

module.exports = CAModalLogin;

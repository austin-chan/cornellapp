/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalSignup renders inside of CAModal and represents the signup view.
 * Component styles are located in _CAModalSignup.scss.
 */

var React = require('react/addons'),
    ModalActions = require('../actions/ModalActions'),
    _ = require('underscore');

var CAModalSignup = React.createClass({
    componentWillMount: function() {
        this.loading = false;
    },

    /**
     * Fill in the name field from the netid if the name field is empty and not
     * in focus. Feels like magic.
     */
    autoFillName: function(name) {
        var nameField = React.findDOMNode(this.refs.nameField);
console.log(!$(nameField).is(':focus'));
console.log(!$.trim(nameField.value).length);
        if (!$(nameField).is(':focus') && !$.trim(nameField.value).length) {
            nameField.value = name;
            console.log(name);
        }
    },

    render: function() {
        return (
            <div className="ca-modal-signup">
                <h3>Sign up with Cornellapp</h3>
                <div className="input-group">
                    <input className="ca-clear-input" type="text"
                        ref="netidField" placeholder="NetID"
                        onKeyDown={this._onKeyDown}
                        onBlur={this._onBlurNetid} />
                    <input className="ca-clear-input" type="password"
                        placeholder="Password" onKeyDown={this._onKeyDown} />
                    <input className="ca-clear-input" type="text"
                        ref="nameField" placeholder="Full Name"
                        onKeyDown={this._onKeyDown} />
                </div>
                <div className="button-group">
                    <button className="ca-red-button"
                        onClick={this._onSignup}
                        ref="signupButton">
                        <span className="label">Sign Up</span>
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
                        onClick={this._onLogin}>
                        Or Log In Instead
                    </button>
                </div>
            </div>
        );
    },

    /**
     * Event handler for logging in instead.
     */
    _onLogin: function() {
        ModalActions.login();
    },

    /**
     * Event handler for blurring the Netid field. Auto-fills the full name
     * field.
     */
    _onBlurNetid: function(e) {
        var netidValue = React.findDOMNode(this.refs.netidField).value,
            nameValue = React.findDOMNode(this.refs.nameField).value;

        // Skip if the netid field is empty or the name field is not empty.
        if (!$.trim(netidValue).length || $.trim(nameValue).length)
            return;

        $.ajax({
            url: '/api/fetch-name',
            data: { netid: netidValue },
            success: _.bind(function(name) {
                if (name.length)
                    this.autoFillName(name);
            }, this)
        });
    },

    /**
     * Event handler for pressing down a key.
     */
    _onKeyDown: function(e) {
        if (e.key === 'Enter')
            this._onSignup();
    },

    /**
     * Event handler for attempting a sign up.
     */
    _onSignup: function() {
        // Prevent double submitting.
        if (this.loading)
            return;

        var signupButton = React.findDOMNode(this.refs.signupButton);
        $(signupButton).addClass('loading');

        this.loading = true;
    }
});

module.exports = CAModalSignup;

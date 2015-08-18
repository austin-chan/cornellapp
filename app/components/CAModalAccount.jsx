/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalAccount renders inside of CAModal and represents the account settings
 *  view. Component styles are located in _CAModalAccount.scss.
 */

var React = require('react/addons'),
    ModalActions = require('../actions/ModalActions'),
    UserActions = require('../actions/UserActions'),
    classNames = require('classnames');

var CAModalAccount = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            loading: false,
            errorMessage: ''
        };
    },

    /**
     * Abort any pending requests.
     */
    componentWillUnmount: function() {
        if (this.jqXHR && this.jqXHR.readyState !== 4)
            this.jqXHR.abort();

        if (this.jqXHRName && this.jqXHRName.readyState !== 4)
            this.jqXHRName.abort();
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
     * Receive and parse the response from an attempt to save.
     * @param {object} data Response data for the save attempt.
     */
    receiveSaveResponse: function(data) {
        this.setState({
            loading: false
        });

        if (data.error)
            return this.displayErrorMessage(data.error);
    },

    render: function() {
        var errorMessage,
            name = this.props.name,
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
            <div className="ca-modal-account">
                <h3>My Account</h3>
                <form ref="form" onSubmit={this._onLogin}>
                    <div className="input-group">
                        <p className="input-label">Full Name</p>
                        <input className="ca-clear-input" type="text"
                            name="name" ref="nameField" placeholder="Full Name"
                            onKeyDown={this._onKeyDown} defaultValue={name}
                            onBlur={this._onBlurNetid} required />
                        <p className="input-label">Change Password</p>
                        <input className="ca-clear-input old_password"
                            type="password" name="old_password"
                            placeholder="Current Password"
                            onKeyDown={this._onKeyDown} required/>
                        <input className="ca-clear-input" type="password"
                            name="new_password" placeholder="NEW PASSWORD"
                            onKeyDown={this._onKeyDown} required/>
                    </div>
                    {errorMessage}
                    <div className="button-group">
                        <button className={submitButtonClass}
                            onClick={this._onSave}
                            ref="submit">
                            <span className="label">Save Changes</span>
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
                    </div>
                </form>
            </div>
        );
    },

    /**
     * Event handler for logging in instead.
     * @param {object} e Event object.
     */
    _onLogin: function(e) {
        e.preventDefault();
        ModalActions.login();
    },

    /**
     * Event handler for pressing down a key.
     */
    _onKeyDown: function(e) {
        if (e.key === 'Enter')
            React.findDOMNode(this.refs.submit).click();
    },

    /**
     * Event handler for attempting a save.
     */
    _onSave: function(e) {
        e.preventDefault();

        // Prevent double submitting.
        if (this.state.loading)
            return;

        var form = React.findDOMNode(this.refs.form),
            formObj = $(form).serializeObject();

        if (formObj.name)
            UserActions.changeName(formObj.name);

        // Save netid to possibly pass to activation modal.
        this.submittedNetid = $.trim(formObj.netid);
        this.jqXHR = $.ajax({
            type: 'post',
            url: '/api/user',
            data: formObj,
            success: this.receiveSaveResponse
        });

        this.setState({
            loading: true
        });
    }
});

module.exports = CAModalAccount;

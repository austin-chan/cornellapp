/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalSendSchedule renders a reusable modal to present a shareable link and
 * a screenshot texter input. Component styles are located in
 * _CAModalSendSchedule.scss.
 */

var React = require('react/addons'),
    ModalActions = require('../actions/ModalActions'),
    UserStore = require('../stores/UserStore'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames');

var CAModalSendSchedule = React.createClass({
    propTypes: function() {
        return {
            schedule: React.PropTypes.string
        };
    },

    getInitialState: function() {
        return {
            errorMessage: '',
            texting: false
        };
    },

    componentDidMount: function() {
        // Load a new schedule object for the semester if the user does not
        // have a schedule object yet.
        if (!this.props.schedule) {
            this.load();
        }
    },

    /**
     * Abort any pending requests.
     */
    componentWillUnmount: function() {
        if (this.jqXHR && this.jqXHR.readyState !== 4)
            this.jqXHR.abort();
    },

    /**
     * Load a new schedule object for the semester for the user.
     */
    load: function() {
        $.ajax({
            type: 'POST',
            url: '/api/schedule/' + ScheduleStore.getSemester().slug,
            success: function(data) {
                ModalActions.addSchedule(data);
            }
        });
    },

    /**
     * Receive and parse the response from an attempt to text a screenshot.
     * @param {object} data Response data for the text message attempt.
     */
    receiveTextResponse: function(data) {
        this.setState({
            texting: false
        });

        if (data.error)
            return this.displayErrorMessage(data.error);
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
     * Render an empty modal except for the loading spinner.
     * @return {object} Renderable object to represent the modal.
     */
    renderLoading: function() {
        return (
            <div className="ca-modal-send-schedule loading">
                <div className="spin-loader dark main">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    },

    render: function() {
        if (!this.props.schedule)
            return this.renderLoading();

        var scheduleUrl = UserStore.getDomain() + '/schedule/' +
                this.props.schedule,
            textButtonClass = classNames('ca-red-button', {
                loading: this.state.texting
            }),
            message = null;

        if (this.state.errorMessage)
            message = (
                <p className="error-message">
                    {this.state.errorMessage}
                </p>
            );
        else if (this.state.texting)
            message = (
                <p className="notice-message">
                    You should receive a text in about 20-25 seconds.
                </p>
            );


        return (
            <div className="ca-modal-send-schedule">
                <h3>Send Schedule</h3>
                <p className="input-label">Schedule Link</p>
                <p className="share-link">{scheduleUrl}</p>
                <p className="input-label">Text Screenshot to Mobile</p>
                <input className="ca-clear-input phone"
                    type="tel" name="phone" ref="number"
                    placeholder="Phone Number"
                    onKeyDown={this._onKeyDown} required/>
                <div className="button-group">
                    <button className={textButtonClass}
                        onClick={this._onText}
                        ref="text">
                        <span className="label">Text Screenshot</span>
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
                    {message}
                </div>
            </div>
        );
    },

    /**
     * Event handler for texting the screenshot.
     */
    _onText: function(e) {
        e.preventDefault();

        // Prevent double submitting.
        if (this.state.texting)
            return;

        var number = React.findDOMNode(this.refs.number).value + '';

        // Verify that the schedule exists.
        if (!this.props.schedule)
            return this.displayErrorMessage(
                'An error occurred. Please reload the page.');

        // Display an error message if the number contains letters.
        if (strutil.containsLetters(number))
            return this.displayErrorMessage(
                'Please enter a valid US phone number.');

        number = number.replace(/\D/g,'');

        // Quick and dirty check for the validity of the phone number
        if (number.length !== 10 && (number.length !== 11 || number[0] != '1'))
            return this.displayErrorMessage(
                'Please enter a valid US phone number.');

        if (number.length === 10)
            number = '1' + number;

        this.jqXHR = $.ajax({
            type: 'post',
            url: '/api/text-screenshot/' + this.props.schedule,
            data: {
                number: number
            },
            success: this.receiveTextResponse
        });

        this.setState({
            texting: true,
            errorMessage: ''
        });
    },

    /**
     * Event handler for pressing down a key.
     */
    _onKeyDown: function(e) {
        if (e.key === 'Enter')
            React.findDOMNode(this.refs.text).click();
    }
});

module.exports = CAModalSendSchedule;

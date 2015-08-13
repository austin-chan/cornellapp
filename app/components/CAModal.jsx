/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModal renders a reusable modal to present in the center of the window.
 * Component styles are located in _CAModal.scss.
 */

var React = require('react/addons'),
    CAModalLogin = require('./CAModalLogin'),
    CAModalSignup = require('./CAModalSignup'),
    ModalActions = require('../actions/ModalActions'),
    classNames = require('classnames');

var CAModal = React.createClass({
    propTypes: function() {
        return {
            active: React.PropTypes.boolean.isRequired,
            type: React.PropTypes.string.isRequired
        };
    },

    renderContent: function() {
        if (this.props.type === 'login')
            return <CAModalLogin />;
        if (this.props.type === 'signup')
            return <CAModalSignup />;
    },

    render: function() {
        var rootClass = classNames('ca-modal', {
            show: this.props.active
        });

        return (
            <div className={rootClass}>
                <div className="overlay" onClick={this._onClose}></div>
                <div className="modal">
                    <div className="modal-content">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Event handler for closing the modal.
     */
    _onClose: function() {
        ModalActions.close();
    }
});

module.exports = CAModal;

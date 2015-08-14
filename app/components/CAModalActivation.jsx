/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModalActivation renders inside of CAModal and represents the view waiting
 * for activation. Component styles are located in _CAModalActivation.scss.
 */

var React = require('react/addons'),
    ModalActions = require('../actions/ModalActions'),
    classNames = require('classnames');

var CAModalActivation = React.createClass({
    propTypes: {
        netid: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div className="ca-modal-activation">
                <i className="icon icon-drafts"></i>
                <p>Open the Confirmation Email Sent to<br/>
                    {this.props.netid}@cornell.edu to Complete Sign Up</p>
                <a href="http://cmail.cornell.edu" target="_blank"
                    className="ca-simple-button">
                    Open CMail in a New Tab
                </a>
            </div>
        );
    }
});

module.exports = CAModalActivation;

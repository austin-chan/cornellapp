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
    render: function() {
        return (
            <div>
                <i className="icon-drafts"></i>
                <p>Open the Confirmation Email Sent to
                    bae237@cornell.edu to Complete Sign Up</p>
                <button className="ca-simple-button">
                    OPEN CMAIL IN A NEW TAB
                </button>
            </div>
        );
    }
});

module.exports = CAModalActivation;

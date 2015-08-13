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

var React = require('react/addons');

var CAModalLogin = React.createClass({
    render: function() {
        return (
            <div className="ca-modal-login">
                <h3>Log in to Cornellapp</h3>
                <div className="input-group">
                    <input className="ca-clear-input" type="text"
                        placeholder="NetID" />
                    <input className="ca-clear-input" type="password"
                        placeholder="Password" />
                </div>
                <div className="button-group">
                    <button className="ca-red-button">Log In</button>
                    <button className="ca-simple-button condensed">
                        Or Sign Up Instead
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = CAModalLogin;

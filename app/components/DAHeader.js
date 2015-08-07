/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DAHeader is handles the site's header. Component styles are located in
 * _DAHeader.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons');

var DAHeader = React.createClass({
    render: function() {
        var context = {};

        if (process.env.NODE_ENV == 'browserify') {
            context = JSON.parse(
                document.getElementById('context').textContent);
        }

        return (
            <header className="da-header">
                <div className="container">
                    <div className="left">
                        <p className="logo museo-sans">Drakeapp</p>
                        <div className="account-buttons">
                            <button className="da-outline-button">
                                Sign Up
                            </button>
                            <button className="da-outline-button">
                                Log In
                            </button>
                        </div>
                    </div>
                    <div className="right">
                        <div className="semester-buttons">
                            <button className="da-fill-button">
                                SUMMER 2015
                            </button>
                            <button className="da-fill-button selected">
                                FALL 2015
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = DAHeader;

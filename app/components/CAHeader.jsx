/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAHeader is handles the site's header. Component styles are located in
 * _CAHeader.scss.
 */

var React = require('react/addons');

var CAHeader = React.createClass({
    render: function() {
        var context = {};

        if (process.env.NODE_ENV == 'browserify') {
            context = JSON.parse(
                document.getElementById('context').textContent);
        }

        return (
            <header className="ca-header">
                <div className="container">
                    <div className="left">
                        <p className="logo museo-sans">Cornellapp</p>
                        <div className="account-buttons">
                            <button className="ca-outline-button">
                                Sign Up
                            </button>
                            <button className="ca-outline-button">
                                Log In
                            </button>
                        </div>
                    </div>
                    <div className="right">
                        <div className="semester-buttons">
                            <button className="ca-fill-button">
                                SUMMER 2015
                            </button>
                            <button className="ca-fill-button selected">
                                FALL 2015
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = CAHeader;

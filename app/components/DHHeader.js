/**
 * DHHeader.js
 * Davyhoy
 *
 * Created by Austin Chan on August 3, 2015.
 * Copyright (c) 2015, Davyhoy. All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 * @jsx React.DOM
 */

var React = require('react/addons');

/**
 * DHHeader is handles the site's header.
 *
 * Component styles are located in _DHHeader.scss.
 */

module.exports = React.createClass({
    render: function() {
        var context = {};

        if (process.env.NODE_ENV == 'browserify') {
            context = JSON.parse(
                document.getElementById('context').textContent);
        }

        return (
            <header id="dh-header">
                <div className="container">
                    <div className="left">
                        <p className="logo museo-sans">Davyhoy</p>
                        <div className="account-buttons">
                            <button className="outline">Sign Up</button>
                            <button className="outline">Log In</button>
                        </div>
                    </div>
                    <div className="right">
                        <div className="semester-buttons">
                            <button className="fill">SUMMER 2015</button>
                            <button className="fill selected">FALL 2015</button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
});

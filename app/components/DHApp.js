/**
 * DHApp.js
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

var React = require('react/addons'),
    DHHeader = require('./DHHeader');

/**
 * DavyhoyApp is the main component that contains all of the subcomponents in
 * the whole Davyhoy application.
 *
 * Component styles are located in _DavyhoyApp.scss.
 */

module.exports = React.createClass({
    render: function() {
        return (
            <div>
            <DHHeader />
            hillo
            </div>
        );
    }
});

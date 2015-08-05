/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DHApp is the main component that contains all of the subcomponents in the
 * Davyhoy application. Component styles are located in _DHApp.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DHHeader = require('./DHHeader'),
    DHBasket = require('./DHBasket'),
    DHSchedule = require('./DHSchedule');

module.exports = React.createClass({
    displayName: 'DHApp',

    render: function() {
        return (
            <div id="dh-app">
                <DHHeader />

            </div>
        );
    }
});

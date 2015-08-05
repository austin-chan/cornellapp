/**
 * DHBasket.js
 * Davyhoy
 *
 * Created by Austin Chan on August 4, 2015.
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
 * DHBasket handles the course list of the application.
 *
 * Component styles are located in _DHBasket.scss.
 */

module.exports = React.createClass({

    displayName: 'DHBasket',

    render: function() {
        return (
            <div id="dh-basket">
                <div className="search-item">
                    <i className="icon icon-add"></i>
                    <div className="input-wrapper">
                        <input type="text" placeholder="Add a Course" />
                    </div>
                </div>
            </div>
        );
    }
});

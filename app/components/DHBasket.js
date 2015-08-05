/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DHBasket lists all the courses a user has added. Component styles are located
 * in _DHBasket.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DHCourseAdder = require('./DHCourseAdder');

module.exports = React.createClass({
    displayName: 'DHBasket',

    render: function() {
        return (
            <div className="dh-basket">
                <DHCourseAdder />
                <p className="empty-label">No Courses Added</p>
            </div>
        );
    }
});

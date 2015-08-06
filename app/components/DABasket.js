/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DABasket lists all the courses a user has added. Component styles are located
 * in _DABasket.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DACourseAdder = require('./DACourseAdder'),
    classNames = require('classnames');

module.exports = React.createClass({
    displayName: 'DABasket',

    render: function() {
        var rootClass = classNames('da-basket',
            { empty: !Object.keys(this.props.courses).length });

        return (
            <div className={rootClass}>
                <DACourseAdder semester={this.props.semester} />
                <p className="empty-label">No Courses Added</p>
            </div>
        );
    }
});

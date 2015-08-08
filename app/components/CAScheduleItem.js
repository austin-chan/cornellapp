/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleItem represents a rendering of a course section.
 * are located in _CAScheduleItem.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons');

var CAScheduleItem = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <div className="ca-schedule-item">
                {this.props.course.raw.subject}
            </div>
        );
    }
});

module.exports = CAScheduleItem;

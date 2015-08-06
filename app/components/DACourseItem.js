/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DACourseItem is the component that displays course information for each
 * course in the schedule basket.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleActions = require('../actions/ScheduleActions'),
    _ = require;

module.exports = React.createClass({
    displayName: 'DACourseItem',

    render: function() {
        return (
            <div className="da-course-adder">
                <i className="icon icon-add"></i>
                <div className="input-wrapper">
                    <input type="text" placeholder="Add a Course" ref="input" />
                </div>
            </div>
        );
    }
});

/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DHCourseAdder renders an input that can add courses to the course basket.
 * Component styles are located in _DHCourseAdder.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons');

module.exports = React.createClass({
    displayName: 'DHCourseAdder',

    componentDidMount: function() {
        var x = global.$.ajax;
    },

    render: function() {
        return (
            <div className="dh-course-adder">
                <i className="icon icon-add"></i>
                <div className="input-wrapper">
                    <input type="text" placeholder="Add a Course" />
                </div>
            </div>
        );
    }
});

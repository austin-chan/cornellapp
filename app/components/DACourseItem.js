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
    strutil = require('../utils/strutil');

module.exports = React.createClass({
    displayName: 'DACourseItem',

    render: function() {
        var course = this.props.course,
            description = strutil.shorten(course.raw.description, 140, 3),
            headerTitle = course.raw.subject + ' ' + course.raw.catalogNbr +
                ': ' + course.raw.titleLong;

        headerTitle = strutil.shorten(headerTitle, 36, 2);

        console.log(course);

        return (
            <div className="da-course-item blue">
                <div className="item-header">
                    <div className="da-toggle">
                        <i className="icon-check_box on-icon"></i>
                        <i className="icon-check_box_outline_blank off-icon"></i>
                    </div>
                    {headerTitle}
                    <div className="da-close">
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">
                    <p className="professor">Professor Katheleen Gibson</p>
                    <p className="credits freight-sans-pro">5 credits</p>
                    <p className="description freight-sans-pro">
                        {description}
                    </p>
                    <div className="button-area">
                        <button className="da-simple-button">
                            Change Color
                        </button>
                        <button className="da-simple-button">
                            Open in Catalog
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

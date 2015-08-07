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
    DAToggle = require('./DAToggle'),
    DAColorPanel = require('./DAColorPanel'),
    ScheduleActions = require('../actions/ScheduleActions'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames');

var DACourseItem = React.createClass({
    render: function() {
        var course = this.props.course,
            active = course.selection.active,
            rootClass = classNames('da-course-item', course.selection.color,
                { inactive: !course.selection.active });

        // Description for the course item.
        var description = course.raw.description.length ?
            strutil.shorten(course.raw.description, 140, 3) :
            'No description available.';

        // Header for the course item.
        var headerTitle = course.raw.subject + ' ' + course.raw.catalogNbr +
                ': ' + course.raw.titleLong;
        headerTitle = strutil.shorten(headerTitle, 36, 2);

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <DAToggle selected={active} onToggle={this._onToggle} />
                    {headerTitle}
                    <div className="da-close" onClick={this._onRemove}>
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
                        <button className="da-simple-button"
                            onClick={this._onCloseClick}>
                            Open in Catalog
                        </button>
                    </div>
                </div>
                <DAColorPanel />
            </div>
        );
    },

    /**
     * Event handler for toggling the course on and off to apply the course to
     * the schedule.
     */
    _onToggle: function(selected) {
        ScheduleActions.toggle(this.props.course.selection.key, selected);
    },

    /**
     * Event handler for clicking on the x button to remove the course.
     */
    _onRemove: function() {
        ScheduleActions.remove(this.props.course.selection.key);
    }

});

module.exports = DACourseItem;

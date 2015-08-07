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
    DACourseItem = require('./DACourseItem'),
    classNames = require('classnames'),
    _ = require('underscore');

var DABasket = React.createClass({

    render: function() {
        var courseItems = [],
            courses = this.props.courses,
            rootClass = classNames('da-basket',
                { empty: !_.size(this.props.courses) });

        // Get course keys in order.
        var keys = _.sortBy(_.keys(courses)).reverse();
        _.each(keys, function(key) {
            courseItems.push(<DACourseItem key={key} course={courses[key]} />);
        });

        return (
            <div className={rootClass}>
                <DACourseAdder semester={this.props.semester} />

                <p className="empty-label">No Courses Added</p>
                {courseItems}
            </div>
        );
    }
});

module.exports = DABasket;

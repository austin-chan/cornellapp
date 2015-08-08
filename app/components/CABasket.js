/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasket lists all the courses a user has added. Component styles are located
 * in _CABasket.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    CABasketAdder = require('./CABasketAdder'),
    CABasketItem = require('./CABasketItem'),
    classNames = require('classnames'),
    _ = require('underscore');

var CABasket = React.createClass({
    propTypes: {
        courses: React.PropTypes.object.isRequired,
        semester: React.PropTypes.number.isRequired,
    },

    render: function() {
        var courseItems = [],
            courses = this.props.courses,
            rootClass = classNames('ca-basket',
                { empty: !_.size(this.props.courses) });

        // Loop through courses in order.
        var keys = ScheduleStore.getOrderedCourseKeys();
        _.each(keys, function(key) {
            courseItems.push(<CABasketItem key={key} course={courses[key]} />);
        });

        return (
            <div className={rootClass}>
                <CABasketAdder semester={this.props.semester} />

                <p className="empty-label">No Courses Added</p>
                {courseItems}
            </div>
        );
    }
});

module.exports = CABasket;

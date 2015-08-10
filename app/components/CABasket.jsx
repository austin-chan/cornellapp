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
 */

var React = require('react/addons'),
    CABasketAdder = require('./CABasketAdder'),
    CABasketItem = require('./CABasketItem'),
    classNames = require('classnames'),
    _ = require('underscore');

var CABasket = React.createClass({
    propTypes: {
        courses: React.PropTypes.array.isRequired,
        semester: React.PropTypes.number.isRequired,
    },

    render: function() {
        var courseItems = [],
            courses = this.props.courses,
            rootClass = classNames('ca-basket',
                { empty: !_.size(this.props.courses) });

        _.each(courses, function(course) {
            courseItems.push(
                <CABasketItem key={course.selection.key}
                    course={course} />
            );
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

/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasket lists all the courses and events a user has added. Component styles
 * are located in _CABasket.scss.
 */

var React = require('react/addons'),
    CABasketAdder = require('./CABasketAdder'),
    CABasketReview = require('./CABasketReview'),
    CABasketCourse = require('./CABasketCourse'),
    CABasketEvent = require('./CABasketEvent'),
    classNames = require('classnames'),
    _ = require('underscore');

var CABasket = React.createClass({
    propTypes: {
        entries: React.PropTypes.array.isRequired,
        semester: React.PropTypes.object.isRequired,
    },

    render: function() {
        var entryItems = [],
            entries = this.props.entries,
            rootClass = classNames('ca-basket',
                { empty: !_.size(this.props.entries) }),
            review;

        // Loop through all entries.
        _.each(entries, function(entry) {
            if (entry.raw) // is a course
                entryItems.push(
                    <CABasketCourse key={entry.selection.key}
                        course={entry} />
                );
            else // is an event
                entryItems.push(
                    <CABasketEvent key={entry.key}
                        event={entry} />
                );

        });

        if (entryItems.length)
            review = <CABasketReview entries={this.props.entries} />;

        return (
            <div className={rootClass}>
                <CABasketAdder semester={this.props.semester} />
                <p className="empty-label">No Courses Added</p>
                {entryItems}
                {review}
            </div>
        );
    }
});

module.exports = CABasket;

/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasketReview reviews schedule information. Component styles are located in
 * _CABasketReview.scss.
 */


var React = require('react/addons'),
    classNames = require('classnames'),
    pluralize = require('pluralize'),
    strutil = require('../utils/strutil'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ModalActions = require('../actions/ModalActions'),
    _ = require('underscore');

var CABasketReview = React.createClass({
    propTypes: {
        courses: React.PropTypes.array.isRequired,
    },

    render: function() {
        var courseLength = 0,
            credits = 0;

        // Loop through all selected courses.
        _.each(this.props.courses, function(course) {
            // Skip if the course is not set to active.
            if (!course.selection.active)
                return;

            courseLength++;
            credits += parseFloat(course.selection.credits);
        });


        return (
            <div className="ca-basket-review">
                <div className="top">
                    <p className="item courses">
                        <span className="primary">
                            {courseLength}
                        </span>
                        <span className="secondary">
                            {strutil.capitalize(
                                pluralize('courses', courseLength)
                            )}
                        </span>
                    </p>
                    <p className="item credits">
                        <span className="primary">
                            {credits}
                        </span>
                        <span className="secondary">
                            {credits == '1' ? 'Credit' : 'Credits'}
                        </span>
                    </p>
                </div>
                <div className="button-area">
                    <button className="ca-simple-button"
                        onClick={this._onEnrollement}>
                        Enrollment Information
                    </button>
                </div>
            </div>
        );
    },

    /**
     * Event handler for clicking on enrollment information button.
     */
    _onEnrollement: function() {
        ModalActions.enrollment();
    }
});

module.exports = CABasketReview;

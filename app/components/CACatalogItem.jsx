/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogItem is the component that renders a small preview of a course.
 * Component styles are located in _CACatalogItem.scss.
 */

var React = require('react/addons');

var CACatalogItem = React.createClass({
    propTypes: {
        course: React.PropTypes.array.isRequired
    },

    render: function() {
        var course = this.props.course,
            courseHref = 'course/' + course.subject + '/' + course.catalogNbr,
            subjectHref = 'department/' + course.subject;

        return (
            <div className="ca-catalog-item">
                <div className="upper">
                    <span className="tag">
                        <a href={departmentHref}>{course.subject}</a>
                        {course.catalogNbr}
                    </span>
                    <span className="when">{course.catalogWhenOffered}</span>
                    <a href={courseHref} className="title">
                        {course.titleLong}
                    </a>
                </div>
                <div className="lower">
                    <p className="description freight-sans-pro">
                        <%- course.get('description') || 'No description available.' %>
                    </p>
                    <div className="action-buttons">
                        <%- include('like', { course: course, like: like }) %>
                        <%- include('add', { course: course }) %>
                        <a href="<%- courseLink %>" className="ca-catalog-button button">
                            View Details
                        </a>
                    </div>
                    <div className="extra-info freight-sans-pro">
                        <% if (course.get('catalogSatisfiesReq')) { %>
                            <p className="info"><strong>Satisfies Requirement:</strong> <%= course.get('catalogSatisfiesReq') %></p>
                        <% } %>
                        <% if (course.get('catalogBreadth')) { %>
                            <p className="info"><strong>Breadth Requirement:</strong> <%= course.get('catalogBreadth') %></p>
                        <% } %>
                        <% if (course.get('catalogDistr')) { %>
                            <p className="info"><strong>Distribution Category:</strong> <%= course.get('catalogDistr') %></p>
                        <% } %>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CACatalogItem;

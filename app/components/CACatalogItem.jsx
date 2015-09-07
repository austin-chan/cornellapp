/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogItem is the component that renders a preview item for a course.
 * Component styles are located in _CACatalogItem.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ModalActions = require('../actions/ModalActions'),
    CACatalogLike = require('./CACatalogLike'),
    CACatalogAdd = require('./CACatalogAdd'),
    _ = require('underscore');

var CACatalogItem = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    /**
     * Render extra info for the course if there is any to display.
     * @return {array} Array of renderable objects to display extra info.
     */
    renderExtraInfo: function() {
        var course = this.props.course,
            infoList = [],
            infos = [
                ['Satisfies Requirement', 'catalogSatisfiesReq'],
                ['Breadth Requirement', 'catalogBreadth'],
                ['Distribution Category', 'catalogDistr'],
            ];

        _.each(infos, function(info) {
            if (course[info[1]])
                infoList.push(
                    <p key={info[1]} className="info">
                        <strong>{info[0]}:</strong>&nbsp;
                        {info[0]}
                    </p>
                );
        }, this);

        return infoList;
    },

    /**
     * Render the like button for the item.
     * @return {object} Renderable object for the like button.
     */
    renderLikeButton: function() {
        return (
            <CACatalogLike course={this.props.course} />
        );
    },

    /**
     * Render the add course to schedule button.
     * @return {object} Renderable object for the add button.
     */
    renderAddButton: function() {
        return (
            <CACatalogAdd course={this.props.course} />
        );
    },

    render: function() {
        var course = this.props.course,
            description = course.description || 'No description available.',
            extraInfo = this.renderExtraInfo(),
            likeButton = this.renderLikeButton(),
            addButton = this.renderAddButton();

        return (
            <div className="ca-catalog-item">
                <div className="upper">
                    <span className="tag">
                        <a className="subject"
                            onClick={this._onSubjectClick}>
                            {course.subject}
                        </a>&nbsp;
                        {course.catalogNbr}
                    </span>
                    <span className="when">{course.catalogWhenOffered}</span>
                    <p className="title" onClick={this._onCourseClick}>
                        {course.titleLong}
                    </p>
                </div>
                <div className="lower">
                    <p className="description freight-sans-pro">
                        {description}
                    </p>
                    <div className="action-buttons">
                        {likeButton}
                        {addButton}
                        <div onClick={this._onCourseClick}
                            className="ca-catalog-button button">
                            View Details
                        </div>
                    </div>
                    <div className="extra-info freight-sans-pro">
                        {extraInfo}
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Event handler for clicking on a subject link.
     */
    _onSubjectClick: function() {
        ModalActions.catalogSubject(this.props.course.subject);
    },

    /**
     * Event handler for clicking on a course link.
     */
    _onCourseClick: function() {
        var course = this.props.course;
        ModalActions.catalogCourse(course.subject, course.catalogNbr);
    }
});

module.exports = CACatalogItem;

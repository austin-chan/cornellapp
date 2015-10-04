/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogCourse is the component that renders the catalog page for a single
 * course. Component styles are located in _CACatalogCourse.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ScheduleActions = require('../actions/ScheduleActions'),
    ModalActions = require('../actions/ModalActions'),
    CACatalogLike = require('./CACatalogLike'),
    CACatalogAdd = require('./CACatalogAdd'),
    CACatalogGroup = require('./CACatalogGroup'),
    CACatalogComments = require('./CACatalogComments'),
    CACatalogDifficulty = require('./CACatalogDifficulty'),
    classNames = require('classnames'),
    _ = require('underscore');

var CACatalogCourse = React.createClass({
    propTypes: {
        page: React.PropTypes.object,
        course: React.PropTypes.object
    },

    getInitialState: function() {
        return { course: false };
    },

    componentDidMount: function() {
        // Load if no initial courses array was passed on initialization.
        if (!this.props.course)
            this.load();

        // Initialize with props courses data.
        else
            this.setState({ course: this.props.course });
    },

    componentDidUpdate: function(prevProps, __) {
        // Skip if the the props did not change.
        if (_.isEqual(prevProps, this.props))
            return;

        this.setState({ course: false });
        this.load();
    },

    /**
     * Load the rendering data from the backend.
     */
    load: function() {
        $.ajax({
            url: '/catalog/' + this.props.page.strm + '/course/' +
                this.props.page.subject + '/' + this.props.page.number,
            success: _.bind(function(data) {
                this.setState({
                    course: data
                });
            }, this)
        });
    },

    /**
     * Render extra info for the course if there is any to display.
     * @return {array} Array of renderable objects to display extra info.
     */
    renderExtraInfo: function() {
        var course = this.state.course,
            infoList = [],
            infos = [
                ['Fees', 'catalogFee'],
                ['Permission Note', 'catalogPermission'],
                ['Course Attribute', 'catalogAttribute'],
                ['Prerequisites/Corequisites', 'catalogPrereqCoreq'],
                ['Forbidden Overlaps', 'catalogForbiddenOverlaps'],
                ['Satisfies Requirement', 'catalogSatisfiesReq'],
                ['Breadth Requirement', 'catalogBreadth'],
                ['Distribution Category', 'catalogDistr'],
                ['Language Requirement', 'catalogLang'],
                ['Course Subfield', 'catalogCourseSubfield'],
                ['Comments', 'catalogComments'],
            ];

        _.each(infos, function(info) {
            var infoName = info[0],
                infoAttribute = info[1];

            if (course[infoAttribute])
                infoList.push(
                    <p key={infoName} className="info">
                        <strong>{infoName}:</strong>&nbsp;
                        {course[infoAttribute]}
                    </p>
                );
        }, this);

        // Include course outcomes.
        infoList = infoList.concat(this.renderOutcomes());

        return infoList;
    },

    /**
     * Render the outcomes of the course.
     * @return {array} Array of renderable object for the outcomes.
     */
    renderOutcomes: function() {
        var course = this.state.course,
            outcomes = JSON.parse(course.catalogOutcomes);

        if (outcomes.length) {
            var outcomeList = [];

            // Iterate through all outcomes.
            _.each(outcomes, function(outcome) {
                outcomeList.push(
                    <li key={outcome}>{outcome}</li>
                );
            }, this);

            return [
                <p key="p" className="info"><strong>Outcomes:</strong></p>,
                <ul key="ul" className="outcomes">
                    {outcomeList}
                </ul>
            ];
        }

        return [];
    },

    /**
     * Render the like button for the item.
     * @return {object} Renderable object for the like button.
     */
    renderLikeButton: function() {
        return (
            <CACatalogLike course={this.state.course} />
        );
    },

    /**
     * Render the add course to schedule button.
     * @return {object} Renderable object for the add button.
     */
    renderAddButton: function() {
        return (
            <CACatalogAdd course={this.state.course} />
        );
    },

    /**
     * Render the enrollment information for the course.
     * @return {object} Renderable object for the enrollment information.
     */
    renderEnrollment: function() {
        var course = this.state.course,
            groupList = [];

        _.each(course.groups, function(group) {
            groupList.push(
                <CACatalogGroup key={group.id} group={group} />
            );
        }, this);

        return (
            <div className="enrollment course-section">
                <h3>Enrollment Options</h3>
                {groupList}
            </div>
        );
    },

    /**
     * Render the difficulty ratings for a course.
     * @return {object} Renderable object for the difficulty ratings.
     */
    renderDifficulty: function() {
        return (
            <CACatalogDifficulty course={this.state.course} />
        );
    },

    /**
     * Render the comments for a course.
     * @return {object} Renderable object for the comments section.
     */
    renderComments: function() {
        return (
            <CACatalogComments course={this.state.course} />
        );
    },

    render: function() {
        // Not loaded yet.
        if (!this.state.course)
            return (<div></div>);

        var course = this.state.course,
            description = course.description || 'No description available.',
            extraInfo = this.renderExtraInfo(),
            likeButton = this.renderLikeButton(),
            addButton = this.renderAddButton(),
            enrollment = this.renderEnrollment(),
            comments = this.renderComments(),
            difficulty = this.renderDifficulty();

        return (
            <div className="ca-catalog-course ca-catalog-item">
                <div className="upper">
                    <span className="tag">
                        <a className="subject"
                            onClick={this._onSubjectClick}>
                            {course.subject}
                        </a>&nbsp;
                        {course.catalogNbr}
                    </span>
                    <span className="when">{course.catalogWhenOffered}</span>
                    <p className="title">
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
                    </div>
                    <div className="extra-info freight-sans-pro">
                        {extraInfo}
                    </div>
                </div>
                {enrollment}
                {difficulty}
                {comments}
            </div>
        );
    },

    /**
     * Event handler for clicking on a subject link.
     */
    _onSubjectClick: function() {
        ModalActions.catalogSubject(this.state.course.subject);
    },
});

module.exports = CACatalogCourse;

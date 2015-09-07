/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogList is the component that displays an aggregate of courses.
 * Component styles are located in _CACatalogList.scss.
 */

var React = require('react/addons'),
    CACatalogItem = require('./CACatalogItem'),
    _ = require('underscore');

var CACatalogList = React.createClass({
    propTypes: {
        page: React.PropTypes.object,
        courses: React.PropTypes.array
    },

    getInitialState: function() {
        return {
            courses: []
        };
    },

    // Trigger a page change if the page was changed.
    componentDidUpdate: function(prevProps, __) {
        // Skip if the the props did not change.
        if (_.isEqual(prevProps, this.props))
            return;

        this.setState({ courses: false });
        this.load();
    },

    componentDidMount: function() {
        // Load if no initial courses array was passed on initialization.
        if (!this.props.courses)
            this.load();

        // Initialize with props courses data.
        else
            this.setState({ courses: this.props.courses });
    },

    /**
     * Load the rendering data from the backend.
     */
    load: function() {
        var url = '/catalog/' + this.props.page.strm;

        if (this.props.page.type === 'subject')
            url += '/subject/' + this.props.page.subject;

        else if(this.props.page.type === 'random')
            url += '/random';

        else if(this.props.page.type === 'most-liked')
            url += '/most-liked';

        $.ajax({
            url: url,
            success: _.bind(function(data) {
                this.setState({ courses: data });
            }, this)
        });
    },

    /**
     * Render a course item preview.
     * @param {object} course Course object to render a preview for.
     * @return {object} Renderable object to display the course information
     *      preview.
     */
    renderCourse: function(course) {
        return (
            <CACatalogItem key={course.id} course={course} />
        );
    },

    render: function() {
        var courses = this.state.courses,
            itemList = [],
            emptyMessage = null;

        // Iterate through all of the courses in the list.
        _.each(courses, function(course) {
            itemList.push(this.renderCourse(course));
        }, this);

        return (
            <div className="ca-catalog-list">
                {itemList}
            </div>
        );
    }
});

module.exports = CACatalogList;

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
        page: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            courses: []
        };
    },

    componentDidMount: function() {
        this.load();
    },

    /**
     * Load the rendering data from the backend.
     */
    load: function() {
        if (this.props.page.type === 'subject') {
            $.ajax({
                url: '/catalog/' + this.props.page.strm + '/subject/' +
                    this.props.page.subject,
                success: _.bind(function(data) {
                    this.setState({
                        courses: data
                    });
                }, this)
            });
        }
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
            itemList = [];

        for (var c = 0; c < courses.length; c++) {
            var course = courses[c];
            itemList.push(this.renderCourse(course));
        }

        return (
            <div className="ca-catalog-list">
                {itemList}
            </div>
        );
    }
});

module.exports = CACatalogList;

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
    CACatalogItem = require('./CACatalogItem');

var CACatalogList = React.createClass({
    propTypes: {
        courses: React.PropTypes.array.isRequired
    },

    /**
     * Render a course item preview.
     * @param {object} course Course object to render a preview for.
     * @return {object} Renderable object to display the course information
     *      preview.
     */
    renderCourse: function(course) {
        return (
            <CACatalogItem />
        );
    },

    render: function() {
        var courses = this.props.courses,
            itemList = [];

        for (var c = 0; c < courses.length; c++) {
            var course = courses[c];
            itemList.push(this.renderCourse(course));
        }

        return (
            <div class="ca-catalog-list">
                {itemList}
            </div>
        );
    }
});

module.exports = CACatalogList;

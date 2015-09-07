/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogSearch is the component that renders search results in the catalog.
 * Component styles are located in _CACatalogSearch.scss.
 */

var React = require('react/addons'),
    CACatalogList = require('./CACatalogList'),
    CACatalogCourse = require('./CACatalogCourse'),
    classNames = require('classnames'),
    _ = require('underscore');

var CACatalogSearch = React.createClass({
    propTypes: {
        page: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            data: [],
            loading: true
        };
    },

    // Trigger a page change if the page was changed.
    componentDidUpdate: function(prevProps, __) {
        // Skip if the the props did not change.
        if (_.isEqual(prevProps, this.props))
            return;

        this.setState({ courses: false, loading: true });
        this.load();

    },

    componentDidMount: function() {
        this.load();
    },

    /**
     * Load the rendering data from the backend.
     */
    load: function() {
        $.ajax({
            url: '/catalog/' + this.props.page.strm + '/search/' +
                this.props.page.term,
            success: _.bind(function(data) {
                this.setState({ data: data, loading: false });
            }, this)
        });
    },

    render: function() {
        var data = this.state.data,
            element = null,
            emptyMessage = null;

        // Empty data.
        if (_.isArray(data) && !data.length) {
            // Finished loading.
            if (!this.state.loading)
                emptyMessage = (
                    <p className="empty-message">
                        No Courses Found
                    </p>
                );

        // Render a list of courses.
        } else if (_.isArray(data)) {
            element = (
                <CACatalogList courses={data} />
            );

        // Render a single course.
        } else {
            element = (
                <CACatalogCourse course={data} />
            );
        }

        return (
            <div className="ca-catalog-search">
                {element}
                {emptyMessage}
            </div>
        );
    }
});

module.exports = CACatalogSearch;

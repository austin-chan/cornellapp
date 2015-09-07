/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogSubjects is the component that displays all of the subjects
 * that offer classes during a semester. Component styles are located in
 * _CACatalogSubjects.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    ModalActions = require('../actions/ModalActions'),
    _ = require('underscore');

var CACatalogSubjects = React.createClass({
    propTypes: {
        page: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            subjects: []
        };
    },

    componentDidMount: function() {
        this.load();
    },

    /**
     * Load the rendering data from the backend.
     */
    load: function() {
        $.ajax({
            url: '/catalog/' + this.props.page.strm + '/subjects',
            success: _.bind(function(data) {
                this.setState({
                    subjects: data
                });
            }, this)
        });
    },

    /**
     * Render an individual subject item.
     * @param {object} subject Subject object to render.
     * @return {object} Renderable object for the subject item.
     */
    renderSubjectItem: function(subject) {
        return (
            <div className="subject-item" key={subject.value}
                onClick={this._onSubjectClick.bind(this, subject.value,
                    subject.descrformal)}>
                <span className="abbreviation">{subject.value}</span>
                <span className="description">{subject.descrformal}</span>
            </div>
        );
    },

    render: function() {
        var subjects = this.state.subjects,
            leftColumnSubjects = [],
            rightColumnSubjects = [];

        // Iterate through all of the subject items to be displayed on the left.
        for (var s = 0; s < Math.floor(subjects.length / 2); s++) {
            leftColumnSubjects.push(
                this.renderSubjectItem(subjects[s])
            );
        }

        // Iterate through all of the subject items to be displayed on the
        // right.
        for (s = Math.floor(subjects.length / 2); s < subjects.length; s++) {
            rightColumnSubjects.push(
                this.renderSubjectItem(subjects[s])
            );
        }

        return (
            <div className="ca-catalog-subjects">
                <div className="left">
                    {leftColumnSubjects}
                </div>
                <div className="right">
                    {rightColumnSubjects}
                </div>
            </div>
        );
    },

    /**
     * Event handler for selecting a subject and changing the catalog page.
     * @param {string} subject Subject abbreviation to change the catalog to.
     * @param {string} formalName Full name of the subject.
     */
    _onSubjectClick: function(subject, formalName) {
        ModalActions.catalog({
            type: 'subject',
            title: formalName,
            subject: subject
        });
    }
});

module.exports = CACatalogSubjects;

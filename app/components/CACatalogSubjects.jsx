/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogSubjects is the component that displays all of the departments
 * that offer classes during a semester. Component styles are located in
 * _CACatalogSubjects.scss.
 */

var React = require('react/addons');

var CACatalogSubjects = React.createClass({
    propTypes: {
        subjects: React.PropTypes.array.isRequired
    },

    /**
     * Render an individual subject item.
     * @param {object} subject Subject object to render.
     * @return {object} Renderable object for the subject item.
     */
    renderSubjectItem: function(subject) {
        var href = 'department/' + subject.value;

        return (
            <a key={subject.value} href={href}>
                <span className="abbreviation">{subject.value}</span>
                <span className="description">{subject.descrformal}</span>
            </a>
        );
    },

    render: function() {
        var subjects = this.props.subjects,
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
    }
});

module.exports = CACatalogSubjects;

/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogGroup is the component that renders a course group for the catalog.
 * Component styles are located in _CACatalogGroup.scss.
 */

var React = require('react/addons'),
    CACatalogSection = require('./CACatalogSection'),
    ModalActions = require('../actions/ModalActions'),
    strutil = require('../utils/strutil'),
    pluralize = require('pluralize'),
    _ = require('underscore');

var CACatalogGroup = React.createClass({
    propTypes: {
        group: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        this.componentMap = {
            LAB: 'laboratory',
            DIS: 'discussion',
            LEC: 'lecture',
            SEM: 'seminar',
            RSC: 'research',
            FLD: 'field studies',
            CLN: 'clinical',
            STU: 'studio',
            TA: 'tutor group',
            IND: 'independent study',
        };
    },

    /**
     * Render the informational line that display which components to choose and
     * the course combination.
     * @return {array} Array of renderable object for the byline.
     */
    renderByline: function() {
        var group = this.props.group,
            componentsRequired = JSON.parse(group.componentsRequired),
            componentsOptional = JSON.parse(group.componentsOptional),
            byline = [];

        // Render the choose components line if necessary.
        if (componentsRequired.length + componentsOptional.length > 1) {
            chooseLine = 'Choose';

            _.each(componentsRequired, function(c) {
                chooseLine += ' one ' + this.componentMap[c];
            });
            chooseLine += '. ';

            if (componentsOptional.length) {
                var comp = componentsOptional[0];
                comp = strutil.capitalize(comp);

                chooseLine += ' ' + comp + ' optional. ';
            }

            byline.push(
                <span key="choose">
                    {chooseLine}
                </span>
            );
        }

        // Render course combinations if necessary.
        var combinations = JSON.parse(group.simpleCombinations);
        if (combinations.length) {
            byline.push(
                <span key="combination">
                    Combined with:&nbsp;
                </span>
            );

            // Iterate through each combination.
            _.each(combinations, function(combination, i) {
                byline.push(
                    <span key={i} className="combination-link"
                        onClick={this._onCourseClick.bind(this,
                        combination.subject, combination.catalogNbr)}>
                        {combination.subject + combination.catalogNbr}
                    </span>
                );

                if (i !== combinations.length - 1)
                    byline.push(
                        <span key={'comma' + i}>
                            ,&nbsp;
                        </span>
                    );
            }, this);
        }

        return (
            <p className="byline">
                {byline}
            </p>
        );
    },

    /**
     * Render the sections for the group.
     * @return {array} Array of renderable objects for the group.
     */
    renderSections: function() {
        var sections = this.props.group.sections,
            sectionList = [];

        // Iterate through each section.
        _.each(sections, function(section) {
            sectionList.push(
                <CACatalogSection key={section.id} section={section}
                    group={this.props.group} />
            );
        }, this);

        return (
            <div className="sections">
                {sectionList}
            </div>
        );
    },

    /**
     * Render the credits information for the group.
     * @return {}
     */
    renderCredits: function() {
        var group = this.props.group,
            creditsLine;

        // Render only one option for credit amount.
        if (group.unitsMaximum == group.unitsMinimum) {
            var credits = group.unitsMaximum;
            creditsLine = credits + ' ' + pluralize('credit', credits);
        } else {
            creditsLine = group.unitsMinimum + '-' + group.unitsMaximum +
                ' credits';
        }

        return (
            <div className="credits">
                <p className="primary">{creditsLine}</p>
                <p className="secondary">{group.gradingBasisLong}</p>
            </div>
        );
    },

    render: function() {
        var byline = this.renderByline(),
            sections = this.renderSections(),
            credits = this.renderCredits();

        return (
            <div className="ca-catalog-group">
                {byline}
                {sections}
                {credits}
                <hr />
            </div>
        );
    },

    /**
     * Event handler for clicking on a course link.
     * @param {string} subject Subject of the course.
     * @param {number} number Catalog number of the course.
     */
    _onCourseClick: function(subject, number) {
        ModalActions.catalog({
            type: 'course',
            title: subject + ' ' + number,
            subject: subject,
            number: number
        });
    }
});

module.exports = CACatalogGroup;

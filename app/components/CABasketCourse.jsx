/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CABasketCourse is the component that displays course information for each
 * course in the schedule basket.
 */

var React = require('react/addons'),
    CAToggle = require('./CAToggle'),
    CAColorPanel = require('./CAColorPanel'),
    ScheduleActions = require('../actions/ScheduleActions'),
    ModalActions = require('../actions/ModalActions'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames'),
    pluralize = require('pluralize'),
    _ = require('underscore');

var CABasketCourse = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            colorSelecting: false
        };
    },

    /**
     * Render the credits label or dropdown depending on the group options.
     * @param {object} course Course object to render credits info for.
     * @param {object} group Group object to render credits info for.
     * @return {object} Renderable object to represent the credits.
     */
    renderCredits: function(course, group) {
        // Credit count is changeable.
        if (group.unitsMinimum != group.unitsMaximum) {
            var creditOptions = [],
                selectedCredits = course.selection.credits,
                creditsMin = parseFloat(group.unitsMinimum),
                creditsMax = parseFloat(group.unitsMaximum),
                smallIncrements = creditsMax % 1 !== 0 || creditsMin % 1 !== 0;

            for (var i = creditsMin; i <= creditsMax;
                i += smallIncrements ? 0.5 : 1) {

                creditOptions.push(
                    <option key={i} value={i}>
                        {i} {pluralize('credits', i)}
                    </option>
                );
            }

            return (
                <span className="section">
                    <select className="freight-sans-pro"
                        onChange={this._onCreditsSelect}
                        value={selectedCredits}>
                        {creditOptions}
                    </select>
                    <i className="icon-arrow_drop_down dropdown"></i>
                </span>
            );

        } else {
            return group.unitsMinimum + ' ' +
                pluralize('credits', group.unitsMinimum);
        }
    },

    /**
     * Render the section info and dropdowns to represent the selected sections
     * for the courses and the professor.
     * @param {object} course Course object to render section info for.
     * @param {object} group Group object to render section info for.
     * @return {array} Array of an array of renderable objects to represent the
     *      section selections and the name of the professor to display.
     */
    renderSectionsAndProfessor: function(course, group) {
        // Section dropdowns to change the sections.
        var sectionLabels = [],
            professor,
            requiredSectionTypes = JSON.parse(group.componentsRequired),
            optionalSectionTypes = JSON.parse(group.componentsOptional),
            allSectionTypes = requiredSectionTypes.concat(optionalSectionTypes);

        // Loop through each section component for the course.
        _.each(allSectionTypes, function(sectionType, index) {
            var options = [],
                sectionsOfType = ScheduleStore.getSectionOptionsOfType(
                    course.selection.key, sectionType),
                selectedSectionOfType = ScheduleStore.getSelectedSectionOfType(
                    course.selection.key, sectionType),
                selectedSectionId = selectedSectionOfType ?
                    selectedSectionOfType.section : 'none';

            // Find professor name in the primary section.
            if (!index && selectedSectionOfType.meetings.length) {
                var meeting = selectedSectionOfType.meetings[0];
                if (meeting.professors.length) {
                    var p = meeting.professors[0];
                    professor = p.firstName + ' ' + p.lastName;
                }
            }
            if (!professor)
                professor = 'Staff';

            // If section type is optional add no selection option.
            if (optionalSectionTypes.indexOf(sectionType) !== -1) {
                var value = '!' + sectionType;
                options.push(
                    <option key="none" value={value}>
                        No {sectionType}
                    </option>
                );
            }

            // Generate all options for the section component.
            _.each(sectionsOfType, function(sectionOption) {
                options.push(
                    <option key={sectionOption.section}
                        value={sectionOption.section}>
                        {sectionOption.ssrComponent} {sectionOption.section}
                    </option>
                );
            }, this);

            var sectionClass = classNames('section', {
                    changeable: options.length > 1
                }),
                dropDown;

            // Render drop down icon if it is changeable.
            if (options.length > 1) {
                dropDown = <i className="icon-arrow_drop_down"></i>;
            }

            sectionLabels.push(
                <span key={sectionType} className={sectionClass}>
                    <span className="middot">&middot;</span>
                    <select className="freight-sans-pro"
                        value={selectedSectionId}
                        onChange={this._onSectionSelect}>
                        {options}
                    </select>
                    {dropDown}
                </span>
            );
        }, this);

        return [sectionLabels, professor];
    },

    render: function() {
        var course = this.props.course,
            group = ScheduleStore.getSelectedGroup(course.selection.key),
            active = course.selection.active,
            rootClass = classNames('ca-basket-item', course.selection.color,
                { inactive: !course.selection.active }),
            credits = this.renderCredits(course, group),
            sectionsAndProfessor =
                this.renderSectionsAndProfessor(course, group),
            sectionLabels = sectionsAndProfessor[0],
            professor = sectionsAndProfessor[1],

        // Description for the course item.
            description = course.raw.description.length ?
                strutil.shorten(course.raw.description, 140, 3) :
                'No description available.',

        // Header for the course item.
            headerTitle = course.raw.subject + ' ' + course.raw.catalogNbr +
                ': ' + course.raw.titleLong;

        headerTitle = strutil.shorten(headerTitle, 36, 2);

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <CAToggle selected={active} onToggle={this._onToggle} />
                    {headerTitle}
                    <div className="ca-close" onClick={this._onRemove}>
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">
                    <p className="professor">{professor}</p>
                    <p className="byline freight-sans-pro">
                        {credits}{sectionLabels}
                    </p>
                    <p className="description freight-sans-pro">
                        {description}
                    </p>
                    <div className="button-area">
                        <button className="ca-simple-button"
                            onClick={this._onColorSelecting.bind(this, true)}>
                            Change Color
                        </button>
                        <button className="ca-simple-button"
                            onClick={this._onCatalogPage}>
                            Open in Catalog
                        </button>
                    </div>
                </div>
                <CAColorPanel selected={course.selection.color}
                    active={this.state.colorSelecting}
                    onDone={this._onColorSelecting.bind(this, false)}
                    onColorChange={this._onColorChange} />
            </div>
        );
    },

    /**
     * Event handler for clicking on Open in Catalog.
     */
    _onCatalogPage: function() {
        var course = this.props.course.raw;
        ModalActions.catalog(
            'course/' + course.subject + '/' + course.catalogNbr
        );
    },

    /**
     * Event handler for toggling the course on and off to apply the course to
     * the schedule.
     */
    _onToggle: function(selected) {
        ScheduleActions.toggle(this.props.course.selection.key, selected);
    },

    /**
     * Event handler for clicking on the x button to remove the course.
     */
    _onRemove: function() {
        ScheduleActions.remove(this.props.course.selection.key);
    },

    /**
     * Event handler for activating and deactivating the color panel.
     * @param {boolean} selecting True to activate the color panel, false to
     *      deactivate it.
     */
    _onColorSelecting: function(selecting) {
        this.setState({
            colorSelecting: selecting
        });
    },

    /**
     * Event handler for changing the course color.
     * @param {string} color Color to change course to.
     */
    _onColorChange: function(color) {
        ScheduleActions.setColor(this.props.course.selection.key, color);
    },

    /**
     * Event handler for selecting a section.
     * @param {object} e Event object from the onChange event.
     */
    _onSectionSelect: function(e) {
        var value = e.target.value;

        // Deselect or select the section.
        if (value[0] === '!') {
            ScheduleActions.deselectSectionType(this.props.course.selection.key,
                value.substring(1));
        } else {
            ScheduleActions.selectSection(this.props.course.selection.key,
                value);
        }
    },

    /**
     * Event handler for selecting the number of credits for a course.
     * @param {object} e Event object from the onChange event.
     */
    _onCreditsSelect: function(e) {
        var value = e.target.value;

        ScheduleActions.selectCredits(this.props.course.selection.key, value);
    }

});

module.exports = CABasketCourse;

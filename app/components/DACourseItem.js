/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DACourseItem is the component that displays course information for each
 * course in the schedule basket.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DAToggle = require('./DAToggle'),
    DAColorPanel = require('./DAColorPanel'),
    ScheduleActions = require('../actions/ScheduleActions'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    classNames = require('classnames'),
    pluralize = require('pluralize'),
    _ = require('underscore');

var DACourseItem = React.createClass({
    getInitialState: function() {
        return {
            colorSelecting: false
        };
    },

    render: function() {
        var self = this,
            course = this.props.course,
            group = ScheduleStore.getGroup(course.selection.key),
            active = course.selection.active,
            rootClass = classNames('da-course-item', course.selection.color,
                { inactive: !course.selection.active });

        // Description for the course item.
        var description = course.raw.description.length ?
            strutil.shorten(course.raw.description, 140, 3) :
            'No description available.';

        // Header for the course item.
        var headerTitle = course.raw.subject + ' ' + course.raw.catalogNbr +
                ': ' + course.raw.titleLong;
        headerTitle = strutil.shorten(headerTitle, 36, 2);

        // Label to display credit count.
        if (group.unitsMinimum == group.unitsMaximum) {
            var credits = group.unitsMinimum + ' ' +
                pluralize('credits', group.unitsMinimum);
        } else {
            var credits = group.unitsMinimum + '-' + group.unitsMaximum +
                'credits';
        }

        // Section dropdowns to change the sections.
        var sectionLabels = [],
            requiredSectionTypes = JSON.parse(group.componentsRequired),
            optionalSectionTypes = JSON.parse(group.componentsOptional),
            allSectionTypes = requiredSectionTypes.concat(optionalSectionTypes);

        // Loop through each section component for the course.
        _.each(allSectionTypes, function(sectionType, index) {
            var options = [],
                sectionsOfType = ScheduleStore.getSectionsOfType(
                    course.selection.key, sectionType, index !== 0),
                selectedSectionOfType = ScheduleStore.getSelectedSectionOfType(
                    course.selection.key, sectionType),
                selectedSectionId = selectedSectionOfType ?
                    selectedSectionOfType.section : 'none';

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
            });

            sectionLabels.push(
                <span key={sectionType} className="section">
                    <span className="middot">&middot;</span>
                    <select className="freight-sans-pro"
                        value={selectedSectionId}
                        onChange={self._onSectionSelect}>
                        {options}
                    </select>
                </span>
            );
        });

        return (
            <div className={rootClass}>
                <div className="item-header">
                    <DAToggle selected={active} onToggle={this._onToggle} />
                    {headerTitle}
                    <div className="da-close" onClick={this._onRemove}>
                        <i className="icon-close"></i>
                    </div>
                </div>
                <div className="item-content">
                    <p className="professor">Professor Katheleen Gibson</p>
                    <p className="byline freight-sans-pro">
                        {credits}{sectionLabels}
                    </p>
                    <p className="description freight-sans-pro">
                        {description}
                    </p>
                    <div className="button-area">
                        <button className="da-simple-button"
                            onClick={this._onColorSelecting.bind(this, true)}>
                            Change Color
                        </button>
                        <button className="da-simple-button">
                            Open in Catalog
                        </button>
                    </div>
                </div>
                <DAColorPanel selected={course.selection.color}
                    active={this.state.colorSelecting}
                    onDone={this._onColorSelecting.bind(this, false)}
                    onColorChange={this._onColorChange} />
            </div>
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
            ScheduleActions.selectSection(this.props.course.selection.key, value);
        }
    }

});

module.exports = DACourseItem;

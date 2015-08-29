/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleCourse represents a rendering of a course section. Component styles
 * are located in _CAScheduleCourse.scss.
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    CAScheduleInstance = require('./CAScheduleInstance'),
    Draggable = require('react-draggable'),
    classNames = require('classnames'),
    _ = require('underscore');

var CAScheduleCourse = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired,
        conflictMap: React.PropTypes.array.isRequired,
        renderMap: React.PropTypes.array.isRequired,
        scheduleStartTime: React.PropTypes.string.isRequired,
        scheduleEndTime: React.PropTypes.string.isRequired,
        pixelsBetweenTimes: React.PropTypes.func.isRequired,
        dayOffsetMap: React.PropTypes.object.isRequired,
        onDragStart: React.PropTypes.func.isRequired,
        onDragEnd: React.PropTypes.func.isRequired
    },

    /**
     * The bounds objct to specify how far the instance can be dragged.
     * See https://github.com/mzabriskie/react-draggable#api.
     * @param {object} section The section object to generate drag bounds for.
     * @return {object} Bounds object for the section.
     */
    boundsForSection: function(section) {
        if (process.env.NODE_ENV !== 'browserify' ||
            _.isEmpty(this.props.dayOffsetMap))
            return { top: 0, left: 0, right: 0, bottom: 0 };

        var meetings = section.meetings,
            instances = [],
            bounds = {
                left: -9999,
                top: -9999,
                right: 9999,
                bottom: 9999
            };

        // Loop through all instances of the section.
        ScheduleStore.iterateInstancesInSection(section,
            _.bind(function(meeting, meetingIndex, day) {

                var horizontalMap = this.props.dayOffsetMap[day],
                    top = this.props.pixelsBetweenTimes(
                        this.props.scheduleStartTime, meeting.timeStart),
                    bottom = this.props.pixelsBetweenTimes(
                        this.props.scheduleEndTime, meeting.timeEnd);

                bounds.top = Math.max(top, bounds.top);
                bounds.left = Math.max(horizontalMap.left, bounds.left);
                bounds.right = Math.min(horizontalMap.right, bounds.right);
                bounds.bottom = Math.min(bottom, bounds.bottom);
        }, this));

        return bounds;
    },

    /**
     * Determine if the section conflicts with any of the sections in
     * sectionList.
     * @param {object} section Section object to check with.
     * @param {array} sectionList Array of section objects to check against.
     * @return {boolean} False if there are no conflicts, true if there are
     *      conflicts.
     */
    conflictsWithSections: function(section, sectionList) {
        return ScheduleStore.conflictInSections(sectionList.concat(section));
    },

    /**
     * Generate markup for a section.
     * @param {object} section Section object to render.
     */
    renderSection: function(section) {
        var instances = [];

        // Loop through all instances of the section.
        ScheduleStore.iterateInstancesInSection(section,
            _.bind(function(meeting, meetingIndex, day) {

            var conflictSlice = ScheduleStore.sliceConflictMap(
                    this.props.conflictMap, meeting, day),
                renderSlice = ScheduleStore.sliceConflictMap(
                    this.props.renderMap, meeting, day),
                conflicts = _.indexOf(conflictSlice, 2) !== -1,
                conflictRenderIndex = 0;

            // Calculate which way to render a conflict sections.
            if (conflicts) {
                var firstColumnEmpty = _.every(renderSlice, function(c) {
                        return c[0] === 0;
                    }),
                    secondColumnEmpty = _.every(renderSlice, function(c) {
                        return c[1] === 0;
                    });

                conflictRenderIndex = firstColumnEmpty ? 0 : 1;

                // Use the least used column if something already is in the
                // slot.
                if (!firstColumnEmpty && !secondColumnEmpty) {
                    var firstColumnDepth = _.filter(renderSlice, function(s) {
                            return s[0] > 0;
                        }).length,
                        secondColumnDepth = _.filter(renderSlice, function(s) {
                            return s[1] > 0;
                        }).length;

                    console.log(firstColumnDepth);
                    console.log(secondColumnDepth);
                    conflictRenderIndex =
                        (secondColumnDepth < firstColumnDepth) ? 1 : 0;
                }

                // Only need to keep track of rendering for conflict sections.
                ScheduleStore.iterateConflictMap(this.props.renderMap,
                    meeting, day, function(i) {
                        i[conflictRenderIndex]++;
                    });
            }

            instances.push(
                <CAScheduleInstance key={meetingIndex + day}
                    course={this.props.course}
                    section={section}
                    meeting={meeting}
                    conflicts={conflicts}
                    conflictRenderIndex={conflictRenderIndex}
                    day={ScheduleStore.getDayMap()[day]}
                    scheduleStartTime={this.props.scheduleStartTime}
                    pixelsBetweenTimes={this.props.pixelsBetweenTimes} />
            );
        }, this));

        return instances;
    },

    render: function() {
        var course = this.props.course,
            sections = ScheduleStore.getSelectedSections(course.selection.key),
            rootClass = classNames('ca-schedule-course',
                course.selection.color),
            sectionsArray = [];

        // Loop through each section of the course.
        _.each(sections, function(section) {
            var instances = this.renderSection(section),
                options = ScheduleStore.getSectionOptionsOfType(
                    course.selection.key, section.ssrComponent),
                hasOptions = _.some(options, function(o) {
                    if (!this.conflictsWithSections(o, [section]))
                        return true;
                }, this), // determine if the course should be draggable
                sectionClass = classNames('schedule-section', {
                    'no-options': !hasOptions
                });

            sectionsArray.push(
                <Draggable key={section.section}
                    ref={section.section}
                    zIndex={100}
                    bounds={this.boundsForSection(section)}
                    onStart={this._onStart.bind(null, course,
                        section.ssrComponent)}
                    onStop={this._onStop.bind(null, section.section)}>

                    <div className={sectionClass}>
                        {instances}
                    </div>
                </Draggable>
            );
        }, this);

        return (
            <div className={rootClass} ref="root">
                {sectionsArray}
            </div>
        );
    },

    /**
     * Event handler for drag start.
     * @param {object} course Course object being dragged.
     * @param {string} sectionType Type of section being dragged.
     */
    _onStart: function(course, sectionType) {
        this.props.onDragStart(course, sectionType);
    },

    /**
     * Event handler for drag stop.
     * @param {string} ref Ref of the draggable element of the event.
     * @param {object} e Event object.
     * @param {object} ui UI information about the draggable.
     */
    _onStop: function(ref, e, ui) {
        this.props.onDragEnd(e, ui, this.refs[ref]);
    }
});

module.exports = CAScheduleCourse;

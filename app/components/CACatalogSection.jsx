/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogGroup is the component that renders a course section for the
 * catalog. Component styles are located in _CACatalogSection.scss.
 */

var React = require('react/addons'),
    CACatalogMeeting = require('./CACatalogMeeting'),
    _ = require('underscore');

var CACatalogSection = React.createClass({
    propTypes: {
        group: React.PropTypes.object.isRequired,
        section: React.PropTypes.object.isRequired
    },

    /**
     * Render the meetings for the section.
     * @return {object} Renderable object for the sections.
     */
    renderMeetings: function() {
        var section = this.props.section,
            meetingList = [];

        // Iterate through all of the meetings.
        _.each(section.meetings, function(meeting) {
            meetingList.push(
                <CACatalogMeeting key={meeting.id} meeting={meeting}
                    group={this.props.group} />
            );
        }, this);

        return (
            <div className="meetings">
                {meetingList}
            </div>
        );
    },

    /**
     * Render notes for the section.
     * @return {object} Renderable object for the notes of the section.
     */
    renderNotes: function() {
        var section = this.props.section,
            notes = JSON.parse(section.notes);

        if (notes.length) {
            return (
                <div className="notes">
                    {notes.join('; ')}
                </div>
            );
        }

        return null;
    },

    render: function() {
        var section = this.props.section,
            meetings = this.renderMeetings(),
            notes = this.renderNotes();

        return (
            <div className="ca-catalog-section">
                <div className="first-column">
                    <div className="tag">
                        {section.ssrComponent} {section.section}
                    </div>
                    <div className="classId">({section.classNbr})</div>
                </div>
                {meetings}
                {notes}
            </div>
        );
    }
});

module.exports = CACatalogSection;

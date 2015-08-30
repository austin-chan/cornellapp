/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAScheduleEvent represents a rendering of an event. Component styles are
 * located in _CAScheduleEvent.scss.
 */

var React = require('react/addons'),
    _ = require('underscore');

var CAScheduleEvent = React.createClass({
    propTypes: {
        event: React.PropTypes.object.isRequired,
        conflictMap: React.PropTypes.array.isRequired,
        renderMap: React.PropTypes.array.isRequired,
        scheduleStartTime: React.PropTypes.string.isRequired,
        scheduleEndTime: React.PropTypes.string.isRequired,
        pixelsBetweenTimes: React.PropTypes.func.isRequired,
        dayOffsetMap: React.PropTypes.object.isRequired,
    },

    render: function() {
        return (
            <div></div>
        );
    }
});

module.exports = CAScheduleEvent;

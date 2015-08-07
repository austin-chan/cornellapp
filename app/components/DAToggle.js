/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DAToggle is a resusable component to render the application's standard
 * checkbox.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    classNames = require('classnames');

var DAToggle = React.createClass({
    propTypes: {
        selected: React.PropTypes.bool.isRequired,
        onToggle: React.PropTypes.func.isRequired
    },

    render: function() {
        var rootClass = classNames('da-toggle', {
            off: !this.props.selected
        });

        return (
            <div className={rootClass} onClick={this._onToggle}>
                <i className="icon-check_box on-icon"></i>
                <i className=
                    "icon-check_box_outline_blank off-icon"></i>
            </div>
        );
    },

    /**
     * Event handler for switching the toggle value.
     */
    _onToggle: function() {
        this.props.onToggle(!this.props.selected);
    }
});

module.exports = DAToggle;

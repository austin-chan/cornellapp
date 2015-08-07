/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DAColorPanel is the color picking panel for course items.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleStore = require('../stores/ScheduleStore'),
    classNames = require('classnames');

 var DAColorPanel = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
        selected: React.PropTypes.string.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onColorChange: React.PropTypes.func.isRequired
    },

    render: function() {
        var swatches = [],
            colors = ScheduleStore.getColors(),
            rootClass = classNames('da-color-panel',
                { inactive: !this.props.active });

        // Iterate through each available color.
        for (var x = 0; x < colors.length; x++) {

            // Generate a swatch for each color.
            var colorClassName = classNames('swatch', colors[x],
                { selected: colors[x] === this.props.selected });
            swatches.push(
                <div key={colors[x]} className={colorClassName}
                    onClick={this._onSelect.bind(this, colors[x])}>
                    <div className="tint"></div>
                    <i className="icon-check check"></i>
                </div>
            );

            // Add a breaking point mid-way through.
            if (x == (colors.length / 2 | 0)) {
                swatches.push(<br key="break" />);
                swatches.push(<div key="push" className="push"></div>);
            }
        }

        return (
            <div className={rootClass}>
                <p>Change Color</p>
                <div className="swatches">{swatches}</div>
                <div className="button-area">
                    <button className="da-simple-button" onClick={this._onDone}>
                        Done
                    </button>
                </div>
            </div>
        );
    },

    /**
     * Event handler for selecting a color.
     * @param {string} color Color string that was selected.
     */
    _onSelect: function(color) {
        if (color === this.props.selected) // ignore if already selected
            return;

        this.props.onColorChange(color);
    },

    /**
     * Event handler for dismissing the color panel.
     */
    _onDone: function() {
        this.props.onDone(false);
    }
});

 module.exports = DAColorPanel;

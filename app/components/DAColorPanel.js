/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DAColorPanel is a color picking panel for course items.
 *
 * @jsx React.DOM
 */

 var React = require('react/addons');

 var DAColorPanel = React.createClass({
    render: function() {
        return (
            <div className="da-color-panel">
                <p>Change Color</p>
                <div className="swatches">
                    <div className="swatch"></div>
                </div>
            </div>
        );
    }
});

 module.exports = DAColorPanel;

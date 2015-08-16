/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalog is the component that slides in and display the course catalog.
 * Component styles are located in _CACatalog.scss.
 */

var React = require('react/addons'),
    ModalStore = require('../stores/ModalStore'),
    _ = require('underscore');

var CACatalog = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired
    },

    render: function() {
        return (
            <div id="ca-catalog">

            </div>
        );
    }
});

module.exports = CACatalog;

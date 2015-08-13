/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CAModal renders a reusable modal to present in the center of the window.
 * Component styles are located in _CAModal.scss.
 */

var React = require('react/addons'),
    CAModalLogin = require('./CAModalLogin'),
    classNames = require('classnames');

var CAModal = React.createClass({
    propTypes: function() {
        return {
            active: React.PropTypes.boolean.isRequired,
            type: React.PropTypes.string.isRequired
        };
    },

    renderContent: function() {
        if (this.props.type === 'login') {
            return <CAModalLogin />;
        }
    },

    render: function() {
        var rootClass = classNames('ca-modal', {
            show: this.props.active
        });

        console.log(this.props.active);

        return (
            <div className={rootClass}>
                <div className="overlay">

                </div>
                <div className="modal">
                    <div className="modal-content">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CAModal;

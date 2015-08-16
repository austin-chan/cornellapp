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
    ModalActions = require('../actions/ModalActions'),
    classNames = require('classnames'),
    ScheduleStore = require('../stores/ScheduleStore'),
    _ = require('underscore');

var CACatalog = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
        return {
            iframeTitle: ''
        };
    },

    /**
     * Automatically update the title of the catalog when the page changes and
     * listen for link clicking in the iframe.
     */
    componentDidMount: function() {
        var self = this;
        $(React.findDOMNode(this.refs.iframe)).on('load', function() {
            var iframeTitle = this.contentDocument.title;

            self.setState({
                iframeTitle: iframeTitle
            });
        });

        window.receiveLink = function(link) {
            console.log(link);
        };
    },

    render: function() {
        var rootClass = classNames('ca-catalog', {
                show: this.props.active
            }),
            iframeSrc = "/catalog/departments/" +
                ScheduleStore.getSemester().strm;

        return (
            <div className={rootClass}>
                <div className="overlay" onClick={this._onClose}></div>
                <div className="window">
                    <div className="window-bar">
                        <p className="logo museo-sans">Cornellapp</p>
                        <i className="icon icon-search"></i>
                        <input type="search"
                            className="ca-clear-input search"
                            placeholder="Search for a course" />
                        <div className="ca-close close" onClick={this._onClose}>
                            <i className="icon-close"></i>
                            <div className="label">Close</div>
                        </div>
                    </div>
                    <div className="navigation-bar">
                        <div className="upper">
                            <div className="navigation-buttons">
                                <button className="back-button disabled">
                                    <i className="icon-keyboard_arrow_left">
                                    </i>
                                </button>
                                <button className="forward-button">
                                    <i className="icon-keyboard_arrow_right">
                                    </i>
                                </button>
                            </div>
                            <p className="title">{this.state.iframeTitle}</p>
                        </div>
                        <div className="navigation-tabs">
                            <button className="ca-simple-button">
                                All Departments
                            </button>
                            <button className="ca-simple-button">
                                Random Courses
                            </button>
                            <button className="ca-simple-button">
                                Most Liked
                            </button>
                        </div>
                    </div>
                    <div className="iframe-wrap">
                        <iframe ref="iframe" src={iframeSrc}></iframe>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Event handler for closing the catalog.
     */
    _onClose: function() {
        ModalActions.close();
    }
});

module.exports = CACatalog;

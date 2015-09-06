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
    ScheduleActions = require('../actions/ScheduleActions'),
    UserStore = require('../stores/UserStore'),
    classNames = require('classnames'),
    ScheduleStore = require('../stores/ScheduleStore'),
    strutil = require('../utils/strutil'),
    _ = require('underscore');

var CACatalog = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
        page: React.PropTypes.string.isRequired,
        hasBack: React.PropTypes.bool.isRequired,
        hasForward: React.PropTypes.bool.isRequired
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
            var iframeTitle = strutil.shorten(this.contentDocument.title, 48);

            self.setState({
                iframeTitle: iframeTitle
            });
        });

        // Global function to direct the catalog to a new page.
        window.receiveLink = function(link) {
            ModalActions.catalog(link);
        };

        // Global function to add a course to the schedule.
        window.addCourse = function(course) {
            ScheduleActions.add(course);
        };

        // Global function to check if a user is logged in.
        window.isLoggedIn = function() {
            return UserStore.isLoggedIn();
        };
    },

    render: function() {
        var rootClass = classNames('ca-catalog', {
                show: this.props.active
            }),
            backClass = classNames('back-button', {
                disabled: !this.props.hasBack
            }),
            forwardClass = classNames('forward-button', {
                disabled: !this.props.hasForward
            });

        return (
            <div className={rootClass}>
                <div className="overlay" onClick={this._onClose}></div>
                <div className="window">
                    <div className="window-bar">
                        <p className="logo museo-sans">Cornellapp</p>
                        <i className="icon icon-search"></i>
                        <input type="search"
                            className="ca-clear-input search"
                            placeholder="Search for a course"
                            ref="search"
                            onKeyDown={this._onSearchDown}/>
                        <div className="ca-close close" onClick={this._onClose}>
                            <i className="icon-close"></i>
                            <div className="label">Close</div>
                        </div>
                    </div>
                    <div className="navigation-bar">
                        <div className="upper">
                            <div className="navigation-buttons">
                                <button className={backClass}
                                    onClick={this._onBack}>
                                    <i className="icon-keyboard_arrow_left">
                                    </i>
                                </button>
                                <button className={forwardClass}
                                    onClick={this._onForward}>
                                    <i className="icon-keyboard_arrow_right">
                                    </i>
                                </button>
                            </div>
                            <p className="title">{this.state.iframeTitle}</p>
                        </div>
                        <div className="navigation-tabs">
                            <button className="ca-simple-button"
                                onClick={this._onAllSubjects}>
                                All Subjects
                            </button>
                            <button className="ca-simple-button"
                                onClick={this._onRandomCourses}>
                                Random Courses
                            </button>
                            <button className="ca-simple-button"
                                onClick={this._onMostLiked}>
                                Most Liked
                            </button>
                        </div>
                    </div>
                    <div className="iframe-wrap">
                        <iframe ref="iframe" src={this.props.page}></iframe>
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Event handler for clicking on Most Liked button.
     */
    _onMostLiked: function() {
        ModalActions.catalog('most-liked');
    },

    /**
     * Event handler for clicking on random courses button.
     */
    _onRandomCourses: function() {
        var randomLink = '/catalog/' + ScheduleStore.getSemester().strm +
            '/random',
            $iframe = $(React.findDOMNode(this.refs.iframe));

        if (this.props.page === randomLink)
            $iframe.attr('src', $iframe.attr('src'));
        else
            ModalActions.catalog('random');

    },

    /**
     * Event handler for keying down in the search bar.
     */
    _onSearchDown: function(e) {
        var value = React.findDOMNode(this.refs.search).value;
        if (e.key === 'Enter' && $.trim(value).length)
            ModalActions.catalog('search/' + value);
    },

    /**
     * Event handler for clicking on All Subjects button.
     */
    _onAllSubjects: function() {
        ModalActions.catalog('subjects');
    },

    /**
     * Event handler for going back a page in the catalog.
     */
    _onBack: function() {
        ModalActions.catalogBack();
    },

    /**
     * Event handler for going forward a page in the catalog.
     */
    _onForward: function() {
        ModalActions.catalogForward();
    },

    /**
     * Event handler for closing the catalog.
     */
    _onClose: function() {
        ModalActions.close();
    }
});

module.exports = CACatalog;

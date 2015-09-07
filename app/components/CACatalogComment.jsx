/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogComment is the component that renders a single comments in the
 * course page of a catalog. Component styles are located in
 * _CACatalogComment.scss.
 */

var React = require('react/addons'),
    UserStore = require('../stores/UserStore'),
    classNames = require('classnames'),
    _ = require('underscore');

var CACatalogComment = React.createClass({
    propTypes: {
        comment: React.PropTypes.object.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },

    /**
     * Render the timestamp with timeago.
     */
    componentDidMount: function() {
        setTimeout(_.bind(function() {
            $(React.findDOMNode(this.refs.timeago)).timeago();
        }, this), 0);
    },

    /**
     * Sanitize and filter a message to safely render and replace newlines with
     * breaking elements.
     * @param {string} message The message to filter.
     * @return {string} The filtered message.
     */
    sanitizeMessage: function(message) {
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br />');
    },

    /**
     * Determine if the comment is upvoted by the user.
     * @return {boolean} True if the comment is upvoted by the user, false if
     *      not.
     */
    isUpvoted: function() {
        var comment = this.props.comment;

        // Only logged in users might have upvoted the comment.
        if (UserStore.isLoggedIn()) {
            var userId = UserStore.getUser().id;

            // Find if any of the upvotes belongs to the user.
            return _.some(comment.upvotes, function(upvote) {
                return upvote.userId == userId;
            });
        }

        return false;
    },

    /**
     * Render the upvote button and upvote count for the comment.
     * @return {object} Renderable object for the upvote button.
     */
    renderUpvoteButton: function() {
        var comment = this.props.comment,
            upvoteClass = classNames('ca-catalog-button', 'upvote',
                'bottom-item');

            // Only logged in users might have upvoted the comment.
            if (this.isUpvoted())
                upvoteClass += ' selected';

        return (
            <div className={upvoteClass} onClick={this._onUpvote}>
                <i className="icon-keyboard_arrow_up"></i>
                <span className="label">{comment.upvotes.length}</span>
            </div>
        );
    },

    /**
     * Render the timestamp for the comment.
     * @return {object} Renderable object for the timestamp of the comment.
     */
    renderTimestamp: function() {
        var created = this.props.comment.created;

        // Turn into a date object if it is a string.
        if (typeof created == 'string')
            created = new Date(created);

        var timestamp = created.toISOString();

        return (
            <div className="created bottom-item timeago" ref="timeago"
                title={timestamp}></div>
        );
    },

    render: function() {
        var comment = this.props.comment,
            message = this.sanitizeMessage(comment.message),
            upvote = this.renderUpvoteButton(),
            timestamp = this.renderTimestamp(),
            deleteButton = null;

        // Render delete button if comment belongs to the user.
        if (UserStore.isLoggedIn() && UserStore.getUser().id == comment.id) {
            deleteButton = (
                <div className="ca-simple-button delete bottom-item"
                    onClick={this._onDelete}>
                    Delete Comment
                </div>
            );
        }

        return (
            <div className="ca-catalog-comment">
                <p className="message freight-sans-pro">
                    {message}
                </p>
                <div className="bottom">
                    {upvote}
                    {timestamp}
                    {deleteButton}
                </div>
            </div>
        );
    },

    /**
     * Event handler for upvoting and unvoting a comment.
     */
    _onUpvote: function() {
        var comment = this.props.comment,
            upvotes = comment.upvotes,
            userId = UserStore.getUser().id;

        // Upvoting if comment has not been upvoted yet.
        if(!this.isUpvoted()) {
            upvotes.push({
                userId: userId
            });

        // Unvoting if the comment is already upvoted.
        } else {
            var index = _.findIndex(upvotes, function(upvote) {
                return upvote.userId == userId;
            });

            // Remove the upvote from upvotes.
            upvotes.splice(index, 1);
        }

        this.forceUpdate();

        // Persist the upvote operation in the backend.
        $.ajax({
            type: this.isUpvoted() ? 'post' : 'delete',
            url: '/api/upvote/' + comment.id
        });
    },

    /**
     * Event handler for deleting the comment.
     */
    _onDelete: function() {
        this.onDelete(this.props.comment.id);
    }
});

module.exports = CACatalogComment;

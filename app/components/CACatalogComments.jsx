/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogComments is the component that renders the comments section for a
 * course in the catalog. Component styles are located in
 * _CACatalogComments.scss.
 */

var React = require('react/addons'),
    CACatalogComment = require('./CACatalogComment'),
    UserStore = require('../stores/UserStore'),
    _ = require('underscore');

var CACatalogComments = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    /**
     * Render all the comments for the comments section.
     * @return {array} Array of renderables for the comments.
     */
    renderComments: function() {
        var comments = this.props.course.comments,
            commentList = [];

        // Iterate through each comment.
        _.each(comments, function(comment) {
            commentList.push(
                <CACatalogComment key={comment.id} comment={comment}
                    onDelete={this._onDelete} />
            );
        }, this);

        return commentList;
    },

    render: function() {
        var course = this.props.course,
            placeholder = 'Share advice and commentary on ' + course.subject +
                course.catalogNbr + '...',
            comments = this.renderComments(),
            emptyMessage = null;

        // Display an empty message if there are no comments.
        if (!comments.length) {
            emptyMessage = (
                <p className="empty-message">No Comments Yet</p>
            );
        }

        return (
            <div className="ca-catalog-comments course-section">
                <h3>Comments</h3>
                <textarea className="comment-box" placeholder={placeholder}
                    ref="textarea">
                </textarea>
                <div className="ca-catalog-button red add-comment"
                    onClick={this._onCreate}>
                    Add Comment
                </div>
                <div className="comments">
                    {comments}
                    {emptyMessage}
                </div>
            </div>
        );
    },

    /**
     * Event handler for creating a new comment.
     */
    _onCreate: function() {
        // Skip if not logged in.
        if (!UserStore.isLoggedIn())
            return;

        var course = this.props.course,
            comments = course.comments,
            $textarea = $(React.findDOMNode(this.refs.textarea)),
            value = $textarea.val(),
            id = (Math.floor(Math.random() * 100000000000)).toString(36);

        // Skip if the comment is empty.
        if (!value.trim().length)
            return;

        // Empty the textarea
        $textarea.val('');

        // Create a new comment object and append it to the comments array.
        comments.unshift({
            id: id,
            crseId: course.crseId,
            created: new Date(),
            userId: UserStore.getUser().id,
            message: value,
            upvotes: []
        });

        // Push the change to render.
        this.forceUpdate();

        // Persist the comment creation operation in the backend.
        $.ajax({
            type: 'post',
            url: '/api/comment/' + course.crseId,
            data: {
                id: id,
                message: value
            }
        });
    },

    /**
     * Event handler for deleting a comment.
     * @param {string} key Id of the comment to delete.
     */
    _onDelete: function(key) {
        var comments = this.props.course.comments,
            index = _.findIndex(comments, function(comment) {
                return comment.id == id;
            });

        // Remove the comment from comments.
        comments.splice(index, 1);

        // Push the change to render.
        this.forceUpdate();

        // Persist the comment deletion operation in the backend.
        $.ajax({
            type: 'delete',
            url: '/api/comment/' + key
        });
    }
});

module.exports = CACatalogComments;

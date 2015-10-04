/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogLike is the component that renders a button to like a course in the
 * catalog. Component styles are located in _CACatalogLike.scss.
 */

var React = require('react/addons'),
    UserStore = require('../stores/UserStore'),
    classNames = require('classnames'),
    _ = require('underscore');

var CACatalogLike = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    /**
     * Determine whether the course has already been liked.
     * @return {boolean} True if the course has been liked, false if not.
     */
    courseIsLiked: function() {
        var likes = this.props.course.likes;

        return UserStore.isLoggedIn() && _.some(likes, function(l) {
                return l.userId == UserStore.getUser().id;
            });
    },

    /**
     * Send a request to the backend to persist a like operation and update the
     * component view.
     * @param {boolean} shouldLike Whether to like or dislike the course.
     */
    processOperation: function(shouldLike) {
        var course = this.props.course;

        this.forceUpdate();

        $.ajax({
            type: 'post',
            url: '/api/like/' + course.crseId + '/' + course.subject,
            data: { shouldLike: shouldLike }
        });
    },

    render: function() {
        var likes = this.props.course.likes,
            likeCount = likes.length,
            isLiked = this.courseIsLiked(),
            hasLikes = likeCount ? 'has-likes' : '',
            rootClass = classNames('ca-catalog-button', 'button', 'like', {
                'liked': isLiked,
                'has-likes': hasLikes
            });

        return (
            <div className={rootClass} onClick={this._onLike}>
                <i className="icon-favorite"></i>
                <span className="label">{likeCount}</span>
            </div>
        );
    },

    /**
     * Event handler for liking and unliked the course.
     */
    _onLike: function() {
        // Skip if not logged in.
        if (!UserStore.isLoggedIn())
            return UserStore.guestNotice('like a course');

        var course = this.props.course,
            likes = course.likes;

        if (this.courseIsLiked()) {
            var indexOf = _.findIndex(likes, function(like) {
                return like.userId == UserStore.getUser().id;
            });

            // Found the like object to remove.
            if (indexOf !== -1) {
                likes.splice(indexOf, 1);
                this.processOperation(false);
            }

        } else {
            // Create a new like object.
            likes.push({ userId: UserStore.getUser().id });

            this.processOperation(true);
        }
    }
});

module.exports = CACatalogLike;

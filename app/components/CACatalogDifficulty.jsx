/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * CACatalogComments is the component that renders the difficulty ratings
 * section in a single course catalog page. Component styles are located in
 * _CACatalogDifficulty.scss.
 */

var React = require('react/addons'),
    UserStore = require('../stores/UserStore'),
    ReactSlider = require('react-slider'),
    _ = require('underscore');

var CACatalogDifficulty = React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            activeValue: 1
        };
    },

    componentWillMount: function() {
        this.allRatings = [
            null,
            'Easy',
            'Moderate',
            'Tough',
            'Very Difficult',
            'Holy Shit'
        ];
    },

    /**
     * Calculate the sum of the values of all the ratings.
     * @return {number} Sum of all of the ratings together.
     */
    calculateRatingSum: function() {
        return _.reduce(this.props.course.ratings, function(sum, rating) {
            return sum + parseInt(rating.value);
        }, 0);
    },

    /**
     * Calculate the number of ratings there are of a certain value.
     * @param {number} value Value to filter ratings for.
     * @return {number} Number of ratings there are of the value.
     */
    ratingCountForValue: function(value) {
        return _.filter(this.props.course.ratings, function(rating) {
            return rating.value == value;
        }).length;
    },

    /**
     * Determine if the user has already rated the course.
     * @return {boolean} True if the user has submitted a rating, false if not.
     */
    userHasRated: function() {
        // Non logged-in users can't have rated the course.
        if (!UserStore.isLoggedIn())
            return false;

        return _.some(this.props.course.ratings, function(rating) {
            return rating.userId == UserStore.getUser().id;
        });
    },

    /**
     * Render the labels for the difficulty ratings.
     * @return {object} Renderable object that contains all of the labels.
     */
    renderLabels: function() {
        var labelList = [],
            allRatings = Array.prototype.slice.call(this.allRatings).reverse();

        // Create a label for all the possible ratings.
        _.each(allRatings, function(rating, i) {
            // Skip if this is the last null label.
            if (!rating)
                return;

            var difficulty = 5 - i;

            labelList.push(
                <p key={i} className="label">
                    {rating}
                </p>
            );
        }, this);

        return (
            <div className="labels">
                {labelList}
            </div>
        );
    },

    /**
     * Render the percentage bar for the difficulty ratings.
     * @return {object} Renderable object that contains all of the ratings
     *      percentage bars.
     */
    renderBars: function() {
        var barList = [],
            allRatings = Array.prototype.slice.call(this.allRatings).reverse();

        // Create a bar for all the possible ratings.
        _.each(allRatings, function(rating, i) {
            // Skip if this is the last null label.
            if (!rating)
                return;

            var difficulty = 5 - i,
                count = this.ratingCountForValue(difficulty),
                barClass = 'bar difficulty' + difficulty,
                width = count ? 100 * count / this.props.course.ratings.length :
                    0;
                barStyle = {
                    width: width + '%'
                };

            barList.push(
                <div key={i} className={barClass}>
                    <div className="fill" style={barStyle}></div>
                </div>
            );
        }, this);

        return (
            <div className="bars">
                {barList}
            </div>
        );
    },

    /**
     * Render the ratings counts for the difficulty ratings.
     * @return {object} Renderable object that contains all of the ratings
     *      counts.
     */
    renderCounts: function() {
        var countList = [],
            allRatings = Array.prototype.slice.call(this.allRatings).reverse();

        // Create a count label for all the possible ratings.
        _.each(allRatings, function(rating, i) {
            // Skip if this is the last null label.
            if (!rating)
                return;

            var difficulty = 5 - i,
                count = this.ratingCountForValue(difficulty);

            countList.push(
                <p key={i} className="count">
                    {count}
                </p>
            );
        }, this);

        return (
            <div className="counts">
                {countList}
            </div>
        );
    },

    /**
     * Render the headline information for the difficulty rating.
     * @return {object} Renderable object for the headline.
     */
    renderHeadline: function() {
        var ratings = this.props.course.ratings;

        // No ratings for the course.
        if (!ratings.length) {
            return (
                <div className="headline">
                    <p className="main-headline">
                        No Ratings
                    </p>
                </div>
            );
        } else {
            var average = this.calculateRatingSum() / ratings.length,
                averageRounded = Math.round(average),
                averageLabel = this.allRatings[averageRounded],
                mainHeadlineClass = 'main-headline difficulty' + averageRounded;

            return (
                <div className="headline">
                    <p className={mainHeadlineClass}>
                        {averageLabel} ({average.toFixed(1)})
                    </p>
                    <p className="second-headline">
                        from {ratings.length} ratings
                    </p>
                </div>
            );
        }
    },

    /**
     * Render the area to add a rating for the course.
     * @return {object} Renderable object to rate the course with.
     */
    renderRateSection: function() {
        var activeValue = this.state.activeValue,
            ratingLabels = [],
            rangeClass = 'slider value' + activeValue,
            allRatings = Array.prototype.slice.call(this.allRatings);

        // Create a rating label for all the possible ratings.
        _.each(allRatings, function(rating, i) {
            // Skip if this is the last null label.
            if (!rating)
                return;

            var difficulty = 5 - i;

            ratingLabels.push(
                <p key={i} className="rating-label">
                    {rating}
                </p>
            );
        }, this);

        return (
            <div className="rate-section">
                <h5>Add a Difficulty Rating</h5>
                <ReactSlider ref="range" defaultValue={activeValue} min={1}
                    max={5} step={1} className={rangeClass}
                    onChange={this._onRangeChange} />
                <div className="rating-labels">
                    {ratingLabels}
                </div>
                <div className="ca-catalog-button red submit"
                    onClick={this._onRatingClick}>
                    Submit Rating
                </div>
            </div>
        );
    },

    render: function() {
        var headline = this.renderHeadline(),
            labels = this.renderLabels(),
            bars = this.renderBars(),
            counts = this.renderCounts(),
            rateSection = this.renderRateSection();

        return  (
            <div className="ca-catalog-difficulty course-section">
                <h3>Difficulty Rating</h3>
                {headline}
                <div className="graph">
                    {labels}
                    {bars}
                    {counts}
                </div>
                {rateSection}
            </div>
        );
    },

    /**
     * Event handler for submitting a rating for the course.
     */
    _onRatingClick: function() {
        // Skip if not logged in.
        if (!UserStore.isLoggedIn())
            return UserStore.guestNotice('rate a course');

        var range = this.refs.range,
            course = this.props.course,
            ratings = course.ratings,
            value = range.getValue();

        // Add a rating to the ratings list.
        if (!this.userHasRated())
            ratings.push({
                userId: UserStore.getUser().id,
                value: value
            });

        // Update the user's rating.
        else
            _.find(ratings, function(rating) {
                return rating.userId == UserStore.getUser().id;
            }).value = value;

        // Push the changes to render.
        this.forceUpdate();

        // Persist the rating operation in the backend.
        $.ajax({
            type: 'post',
            url: '/api/rating/' + course.crseId + '/' + value
        });
    },

    /**
     * Event handler for changing the value of the range slider.
     */
    _onRangeChange: function(v) {
        this.setState({
            activeValue: v
        });
    }
});

module.exports = CACatalogDifficulty;

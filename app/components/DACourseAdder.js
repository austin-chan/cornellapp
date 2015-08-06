/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * DACourseAdder renders an input that can add courses to the course basket.
 * Component styles are located in _DACourseAdder.scss.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    ScheduleActions = require('../actions/ScheduleActions'),
    _ = require;

module.exports = React.createClass({
    displayName: 'DACourseAdder',

    componentDidMount: function() {
        var input = React.findDOMNode(this.refs.input),
            self = this;

        $(input).autocomplete({
            params: {
                semester: function() {
                    return self.props.semester;
                }
            },

            serviceUrl: '/api/search/courses',

            onSelect: function (course) {
                $(input).val('').focus();

                ScheduleActions.add(course);
            },

            formatResult: function(suggestion, currentValue) {
                // Highlight 'CS3410' with no space
                var isLetter = true;
                for (var i = 0; i < currentValue.length && i < 6; i++) {
                    if (isLetter && currentValue[i].match(/[a-z]/i)) {
                        isLetter = false;
                    } else {
                        if (currentValue[i].match(/[0-9]/i)) {
                            currentValue = currentValue.splice(i, 0, ' ');
                        }
                    }
                }

                var cleanTerm = suggestion.value,
                        // .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                    htmlSafeString = cleanTerm
                        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

                currentValue = $.trim(currentValue).replace('  ', ' ')
                    .split(' ').join('|');

                var regex = new RegExp('(' + currentValue + ')', 'gi');
                return htmlSafeString.replace(regex, '<strong>$1<\/strong>');
            },

            // Properly prepare data received from the server
            transformResult: function(response, originalQuery) {
                return {
                    suggestions: JSON.parse(response).map(function(course) {
                        return {
                            value: course.subject + ' ' + course.catalogNbr +
                                ': ' + course.titleLong,
                            data: course
                        };
                    })
                };
            }
        });
    },

    render: function() {
        return (
            <div className="da-course-adder">
                <i className="icon icon-add"></i>
                <div className="input-wrapper">
                    <input type="text" placeholder="Add a Course" ref="input" />
                </div>
            </div>
        );
    }
});

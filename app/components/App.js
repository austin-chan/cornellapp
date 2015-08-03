/** @jsx React.DOM */

var React = require('react/addons');

var ReactApp = React.createClass({

    componentDidMount: function() {
        console.log('hi');
    },

    render: function() {
        var rows = [];
        for (var i = 0; i < 2; i++) {
            rows.push('<div></div>');
        }

        return (
            <div id="table-area">
                {rows}
                hillo
            </div>
        );
    }

});

module.exports = ReactApp;

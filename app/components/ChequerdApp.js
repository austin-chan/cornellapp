/** @jsx React.DOM */

var React = require('react/addons');
var ChequerdHeader = require('./ChequerdHeader');

if (process.browser) require('../styles/style.scss');

var ChequerdApp = React.createClass({

    componentDidMount: function() {
        console.log('hi');
    },

    render: function() {

        return (
            <div>
            <ChequerdHeader />
            hillo
            </div>
        );
    }

});

module.exports = ChequerdApp;

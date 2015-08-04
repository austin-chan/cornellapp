/** @jsx React.DOM */

var React = require('react/addons'),
    DHApp = require('./components/DHApp'),
    mountNode = document.getElementById("davyhoy-app-mount");

React.render(React.createElement(DHApp), mountNode);

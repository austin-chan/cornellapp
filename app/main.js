/** @jsx React.DOM */

var React = require('react/addons'),
    ChequerdApp = require('./components/ChequerdApp'),
    mountNode = document.getElementById("chequerd-app-mount");

React.render(React.createElement(ChequerdApp), mountNode);

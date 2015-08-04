/** @jsx React.DOM */

var React = require('react/addons');
var ChequerdApp = require('./components/ChequerdApp');

var mountNode = document.getElementById("chequerd-app-mount");

// React.render(new ChequerdApp({}), mountNode);
React.render(React.createElement(ChequerdApp), mountNode);

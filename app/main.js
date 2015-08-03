/** @jsx React.DOM */

var React = require('react/addons');
var App = require('./components/App');

var mountNode = document.getElementById("react-main-mount");

React.render(React.createElement(App), mountNode);

/** @jsx React.DOM */

var React = require('react/addons');

var ReactApp = React.createClass({

      componentDidMount: function () {
        console.log('success');

      },
      render: function () {
        return (
          <div id="table-area">
          </div>
        )
      }
  });

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;

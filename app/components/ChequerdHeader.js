/** @jsx React.DOM */

var React = require('react/addons');

var ChequerdHeader = React.createClass({

    render: function() {

        var context = {};

        if (process.env.NODE_ENV == 'browserify') {
            console.log(document.getElementById('context').textContent)
            context = JSON.parse(
                document.getElementById('context').textContent
            );
            console.log(context);
        }

        return (
            <header id="chequerd-header">
                <div className="container">
                    <div className="left">
                        <p className="logo museo-sans">Chequerd</p>
                        <div className="account-buttons">
                            <button className="outline">Sign Up</button>
                            <button className="outline">Log In</button>
                        </div>
                    </div>
                    <div className="right">
                        <button className="outline">Sign Up</button>
                        <button className="outline">Sign Up</button>
                    </div>
                </div>
            </header>
        );
    }

});

module.exports = ChequerdHeader;

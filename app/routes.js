/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * This is the main route declaration file for the Cornellapp application. This
 * routing file uses submodule routers to modularize routes.
 */

var React = require('react/addons'),
    CAApp = React.createFactory(require('./components/CAApp')),
    util = require('util');

module.exports = function(app) {

    app.get('/', function(req, res){
        // React.renderToString takes your component
        // and generates the markup

        var number = 5;

        var reactHtml = React.renderToString(CAApp({ prop: number }));
        var context = JSON.stringify({
            test: 'test'
        });

        res.render('index.ejs', {
            reactOutput: reactHtml,
            context: context
        });
    });

    // "/api"
    require('./routers/apirouter')(app, blockValidationErrors);

};

/**
 * Print out any validation errors with a 400 status and cancel the request.
 * @param {object} req Request object to check validation errors for.
 */
function blockValidationErrors(req, res) {
    var errors = req.validationErrors();
    if (errors) {
        res.send(util.inspect(errors), 400);
        return;
    }
}

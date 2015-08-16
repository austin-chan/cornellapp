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
    UserStore = require('./stores/UserStore'),
    ScheduleStore = require('./stores/ScheduleStore');

module.exports = function(app) {
    var config = app.get('config');

    app.get('/test', function(req, res) {
        req.user.load(['selections.course']).then(function() {
            console.log(req.user.getSelectionData());
        });
    });

    app.get('/', function(req, res) {
        UserStore.reset(req);
        ScheduleStore.reset(req);

        var reactOutput = React.renderToString(CAApp()),
            contextString = JSON.stringify({
                UserStoreSnapshot: UserStore.snapshot(),
                ScheduleStoreSnapshot: ScheduleStore.snapshot()
            });

        res.render('index.ejs', {
            reactOutput: reactOutput,
            contextString: contextString
        });
    });

    // "/api"
    require('./routers/apirouter')(app, blockValidationErrors);
    require('./routers/catalogrouter')(app);
};

/**
 * Print out the first validation error if there are any with a 400 status and
 * cancel the request.
 * @param {object} req Request object to check validation errors for.
 * @param {object} res Response object to output to.
 * @param {function} success Callback function to run if validation produced no
 *      errors.
 */
function blockValidationErrors(req, res, success) {
    var errors = req.validationErrors();
    if (errors)
        return res.status(400).send(errors[0].msg);

    success();
}

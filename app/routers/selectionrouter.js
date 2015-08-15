/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling all api routes.
 */

var strutil = require('../utils/strutil'),
    cornellutil = require('../utils/cornellutil');

var selectionrouter = function(app, blockValidationErrors) {
    var knex = app.get('knex'),
        models = app.get('models'),
        passport = app.get('passport'),
        authorize = app.get('authorize'),
        apiutil = require('../utils/apiutil')(models);

    // Route for adding a course.
    app.post('/api/selection', authorize,
        function(req, res) {
        req.checkBody('tag', 'Provide a tag.').notEmpty();
        req.checkBody('key', 'Provide a key.').notEmpty();
        req.checkBody('color', 'Provide a color.').notEmpty();
        req.checkBody('active', 'Provide an active.').notEmpty().isBoolean();
        req.checkBody('selectedSectionIds', 'Provide selected sections.')
            .notEmpty();

        blockValidationErrors(req, res, function() {
            apiutil.createSelection(req.user, req.body,
                function(err, increment) {
                if (err) {
                    res.status(400);
                    res.send('An error occurred adding the course.');
                    return;
                }

                res.send('' + increment);
            });
        });
    });

    // Route for updating a course.
   app.put('/api/selection', authorize,
        function(req, res) {
        req.checkBody('id', 'Provide an id.').notEmpty().isInt();
        req.checkBody('key', 'Provide a key.').notEmpty();
        req.checkBody('color', 'Provide a color.').notEmpty();
        req.checkBody('active', 'Provide an active.').notEmpty().isBoolean();
        req.checkBody('selectedSectionIds', 'Provide selected sections.')
            .notEmpty();

        blockValidationErrors(req, res, function() {
            apiutil.updateSelection(req.user, req.body, function(err) {
                if (err) {
                    res.status(400);
                    res.send('An error occurred updating the course.');
                    return;
                }

                res.send('ok'); // default code 200
            });
        });
    });

    // Route for deleting a course.
   app.delete('/api/selection', authorize,
        function(req, res) {
        req.checkBody('id', 'Provide an id.').notEmpty().isInt();

        blockValidationErrors(req, res, function() {
            apiutil.deleteSelection(req.user, req.body, function(err) {
                if (err) {
                    res.status(400);
                    res.send('An error occurred removing the course: ' + err);
                    return;
                }

                res.send('ok'); // default code 200
            });
        });
    });


    require('./authenticationrouter')(app, blockValidationErrors);
};

module.exports = selectionrouter;

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
    cornellutil = require('../utils/cornellutil'),
    async = require('async'),
    _ = require('underscore');

var selectionrouter = function(app, blockValidationErrors) {
    var knex = app.get('knex'),
        models = app.get('models'),
        config = app.get('config'),
        passport = app.get('passport'),
        authorize = app.get('authorize'),
        apiutil = require('../utils/apiutil')(models);

    // Route for adding a course.
    app.post('/api/selection', authorize, function(req, res) {
        req.checkBody('strm', 'Provide a strm.').notEmpty();
        req.checkBody('tag', 'Provide a tag.').notEmpty();
        req.checkBody('key', 'Provide a key.').notEmpty();
        req.checkBody('color', 'Provide a color.').notEmpty();
        req.checkBody('credits', 'Provide credits.').notEmpty();
        req.checkBody('active', 'Provide an active.').notEmpty().isBoolean();
        req.checkBody('selectedSectionIds', 'Provide selected sections.')
            .isArray();

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
   app.put('/api/selection', authorize, function(req, res) {
        req.checkBody('id', 'Provide an id.').notEmpty().isInt();
        req.checkBody('key', 'Provide a key.').notEmpty();
        req.checkBody('color', 'Provide a color.').notEmpty();
        req.checkBody('credits', 'Provide credits.').notEmpty();
        req.checkBody('active', 'Provide an active.').notEmpty().isBoolean();
        req.checkBody('selectedSectionIds', 'Provide selected sections.')
            .isArray();

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
   app.delete('/api/selection', authorize, function(req, res) {
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

    // Route for adding an event.
    app.post('/api/event', authorize, function(req, res) {
        req.checkBody('strm', 'Provide a strm.').notEmpty();
        req.checkBody('key', 'Provide a key.').notEmpty();
        req.checkBody('name', 'Provide a name.').notEmpty();
        req.checkBody('location', 'Provide a location.');
        req.checkBody('startTime', 'Provide a start time.').notEmpty();
        req.checkBody('endTime', 'Provide an end time.').notEmpty();
        req.checkBody('color', 'Provide a color.').notEmpty();
        req.checkBody('credits', 'Provide credits.').notEmpty();
        req.checkBody('active', 'Provide an active.').notEmpty().isBoolean();

        blockValidationErrors(req, res, function() {
            apiutil.createEvent(req.user, req.body,
                function(err, increment) {
                if (err) {
                    res.status(400);
                    res.send('An error occurred adding the course.');
                    return;
                }

                res.send('ok');
            });
        });
    });

    // Route for syncing a large number of selections during sign up and log in.
    app.post('/api/selection/sync', authorize, function(req, res) {
        req.checkBody('_data', 'Provide _data.').notEmpty();

        blockValidationErrors(req, res, function() {
            // Payload from client side.
            var _data = req.body._data,
                data = req.user.getSelectionData();

            // Iterate through all semesters and courses in semesters and
            // syncing all courses.
            async.forEachOf(_data, function(semesterData, slug, callback) {
                var semesterCourses = semesterData.courses;
                async.forEachOf(semesterCourses,
                    function(course, key, callback) {

                    var matchingExisting =
                        _.find(data[slug], function(dataCourse) {
                            if (dataCourse.selection.tag ===
                                course.selection.tag)
                            return dataCourse.selection;
                        }),
                        p;

                    // Save new object.
                    if (!matchingExisting) {
                        p = _.pick(course.selection, ['tag', 'key', 'color',
                            'credits', 'active', 'selectedSectionIds']);
                        p.strm = config.semesters[slug].strm;

                        apiutil.createSelection(req.user, p, callback);

                    // Or update
                    } else {
                        p = _.pick(course.selection, ['key', 'color',
                            'credits', 'active', 'selectedSectionIds']);
                        p.id = matchingExisting.selection.id;

                        apiutil.updateSelection(req.user, p, callback);
                    }

                }, function(err) {
                    if (err)
                        return callback(err);

                    callback();
                });
            }, function(err) {
                if (err) {
                    res.status(400);
                    res.send('An error occurred syncing: ' + err);
                    return;
                }

                res.send('ok'); // default code 200
            });
        });
    });

    require('./authenticationrouter')(app, blockValidationErrors);
};

module.exports = selectionrouter;

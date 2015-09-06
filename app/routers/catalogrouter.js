/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling all catalog routes.
 */

var React = require('react/addons'),
    CACatalogSubjects = React.createFactory(
        require('../components/CACatalogSubjects')),
    CACatalogList = React.createFactory(require('../components/CACatalogList')),
    async = require('async');

var catalogrouter = function(app) {
    var models = app.get('models'),
        knex = app.get('knex'),
        apiutil = require('../utils/apiutil')(models),
        _ = require('underscore');

    /**
     * Route for rendering all of the available subjects.
     */
    app.get('/catalog/:strm/subjects', function(req, res) {
        var strm = req.params.strm;

        // Retrieve all subjects for the semester.
        new models.semester({ strm: strm }).fetch().then(function(s) {
            // Error if semester was not found.
            if (!s)
                return res.send('An error occured.');

            var subjects = JSON.parse(s.get('subject_list')),
                reactOutput = React.renderToString(CACatalogSubjects({
                    subjects: subjects
                }));

            res.render('catalog', {
                title: 'All Subjects',
                reactOutput: reactOutput,
                contextString: '',
                script: false
            });
        });
    });

    /**
     * Route for rendering courses for a subject.
     */
    app.get('/catalog/:strm/subject/:subject', function(req, res) {
        var strm = req.params.strm,
            subject = req.params.subject.toUpperCase();

        async.parallel([
            // Retrieve all courses for the subject.
            function(callback) {
                new models.course().where('strm', strm)
                    .where('subject', subject)
                    .fetchAll({
                        withRelated: ['groups.sections.meetings.professors']
                    })
                    .then(function(courses) {
                        // Skip if no courses were found.
                        if (!courses.length)
                            callback('No courses were found');

                        callback(null, courses);
                    });
            },
            // Retrieve the formal name of the subject.
            function(callback) {
                new models.semester({ strm: strm }).fetch()
                    .then(function(semester) {
                    // Find the desired subject element.
                    var formalName =
                        _.find(
                            JSON.parse(semester.get('subject_list')),
                            function(s) { return s.value === subject; }
                        ).descrformal;

                    callback(null, formalName);
                });
            }
        ], function(err, result) {
            if (err)
                return res.send('An error occured. ' + err);

            var courses = result[0],
                formalName = result[1];

            catalogListResponse(req, res, courses, formalName);
        });
    });

    // Route for the page of a single course
    app.get('/catalog/:strm/course/:subject/:number', function(req, res) {
        var strm = req.params.strm,
            subject = req.params.subject.toUpperCase(),
            number = req.params.number;

        new models.course({ strm: strm, subject: subject, catalogNbr: number })
            .fetch({ withRelated: ['groups.sections.meetings.professors'] })
            .then(function(c) {
                if (!c)
                    return res.send('An error occured.');

                c.comments().fetch({ withRelated: ['upvotes'] })
                    .then(function(comments) {

                    comments = comments.toJSON();

                    knex.table('likes')
                        .where('crseId_subject', c.get('crseId') + '_' +
                            c.get('subject'))
                        .select()
                        .then(function(like) {
                            res.render('catalog', {
                                title: '(' + subject + ' ' + number + ') ' +
                                    c.get('titleLong'),
                                type: 'course',
                                course: c,
                                context: [c.toJSON()],
                                comments: comments,
                                like: like,
                                user: req.user ? req.user.id : false,
                                _: _
                            });
                        });
                });
            });
    });

    // Route for searching the catalog.
    app.get('/catalog/:strm/search/:term', function(req, res) {
        var p = {
            query: req.params.term,
            strm: req.params.strm
        };

        apiutil.searchCourses(p, 20, function(err, courses) {
            aggregateResponse(req, res, courses, '"' + req.params.term + '"',
                'department');
        });
    });

    // Route for searching random courses.
    app.get('/catalog/:strm/random', function(req, res) {
        new models.course().query(function(qb) {
            qb.orderByRaw('RAND()').limit(20);
        }).fetchAll().then(function(courses) {
            aggregateResponse(req, res, courses, 'Random Courses',
                'department');
        });
    });

    // Route for getting the most liked courses.
    app.get('/catalog/:strm/most-liked', function(req, res) {
        var strm = req.params.strm;

        knex.table('likes').select(knex.raw('crseId_subject, count(*) as num'))
            .groupBy('crseId_subject').limit(20)
            .orderByRaw('num DESC').select().then(function(likes) {

                var courseQ = new models.course({ strm: strm });

                var crseIds = _.map(likes, function(like) {
                    var split = like.crseId_subject.split('_');

                    courseQ.query(function(qb) {
                        qb.orWhere({ crseId: split[0] })
                        .where({ subject: split[1] });
                    });
                });

                courseQ.fetchAll({ withRelated:
                    ['groups.sections.meetings.professors'] })
                .then(function(courses) {
                    aggregateResponse(req, res, courses, 'Most Liked',
                        'department');
                });
            });

    });

    /**
     * Retrieve all likes information for the courses and then prepare the data
     * to deliver to the client side.
     * @param {object} req Request object for the process.
     * @param {object} res Response object for the process.
     * @param {object} courses Collection of course models.
     * @param {string} title Title of the page.
     */
    function catalogListResponse(req, res, courses, title) {
        courses = courses.toJSON();

        var tagList = _.map(courses, function(course) {
                return course.crseId + '_' + course.subject;
            });

        // Retrieve all likes associated with the courses.
        knex('likes')
            .whereIn('crseId_subject', tagList)
            .select()
            .then(function(likes) {
                // Attach likes to each course object.
                _.each(courses, function(course) {
                    // Filter associated likes for the course.
                    var likesArray = _.filter(likes, function(like) {
                        return like.crseId_subject ===
                            course.crseId + '_' + course.subject;
                    });

                    course.likes = likesArray;
                });

                var reactOutput = React.renderToString(CACatalogList({
                    courses: courses
                }));

                res.render('catalog', {
                    title: 'All Subjects',
                    reactOutput: reactOutput,
                    contextString: '',
                    script: false
                });
            });
    }
};

module.exports = catalogrouter;

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

var catalogrouter = function(app) {
    var models = app.get('models');

    // Route for rendering all of the available departments.
    app.get('/catalog/:strm/departments', function(req, res) {
        var strm = req.params.strm;

        new models.semester({ strm: strm }).fetch().then(function(s) {
            if (!s)
                return res.send('An error occured.');

            res.render('catalog', {
                title: 'All Departments',
                type: 'departments',
                data: JSON.parse(s.get('subject_list'))
            });
        });
    });

    // Route for rendering all of the courses for a department.
    app.get('/catalog/:strm/department/:department', function(req, res) {
        var strm = req.params.strm;
        var department = req.params.department.toUpperCase();

        new models.course().where('strm', strm).where('subject', department)
            .fetchAll().then(function(courses) {
            if (!courses.length)
                return res.send('An error occured.');

            new models.semester({ strm: strm }).fetch().then(function(ss) {
                var s = _.find(JSON.parse(ss.get('subject_list')), function(s) {
                    return s.value === department;
                });

                res.render('catalog', {
                    title: s.descrformal,
                    type: 'department',
                    courses: courses
                });
            });
        });
    });
};

module.exports = catalogrouter;

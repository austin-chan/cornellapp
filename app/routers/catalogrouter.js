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

    app.get('/catalog/departments/:strm', function(req, res) {
        var strm = req.params.strm;

        new models.semester({ strm: strm }).fetch().then(function(s) {
            if (!s)
                return res.send('An error occured.');

            res.render('catalog', {
                type: 'departments',
                data: JSON.parse(s.get('subject_list'))
            });
        });
    });
};

module.exports = catalogrouter;

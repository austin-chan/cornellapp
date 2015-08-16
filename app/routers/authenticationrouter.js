/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling all authentication routes.
 */

var authenticationrouter = function(app, blockValidationErrors) {
    var passport = app.get('passport'),
        models = app.get('models');

    // Route for logging in.
    app.post('/api/login', function(req, res) {
        passport.authenticate('local-login', function(err, user) {
            // Handle invalid authentications.
            if (err)
                return res.json({ error: err });

            // Handle unactivated user logins
            if (!user.get('active'))
                return res.json({
                    error: null,
                    user: user.cleanOutput()
                });

            req.login(user, function(err) {
                if (err)
                    return res.json({ error: err });

                return res.json({
                    error: null,
                    user: user.cleanOutput(),
                    _data: user.getSelectionData()
                });
            });
        })(req, res);
    });

    // Route for signing up.
    app.post('/api/signup', function(req, res) {
        passport.authenticate('local-signup', function(err, user) {
            // Handle invalid authentications.
            if (err)
                return res.json({ error: err });

            user.sendActivationEmail(app.get('config'), function() {
                res.json({
                    error: null,
                    user: user.cleanOutput()
                });
            });
        })(req, res);
    });

    // Route for activating a user account.
    app.get('/activate-user/:activation_key', function(req, res) {
        req.checkParams('activation_key', 'No user was found for the ' +
            'activation key.').notEmpty();

        var error = req.validationErrors();
        if (error)
            return res.render('activation.ejs', {
                error: errors[0].msg
            });

        new models.user({
            activation_key: req.params.activation_key
        }).fetch().then(function(user) {
            if (!user)
                return res.render('activation.ejs', {
                    error: 'No user was found for the activation key.'
                });

            var netid = user.get('netid');

            // Make sure netid hasn't already been used.
            new models.user({
                netid: netid,
                active: 1
            }).fetch().then(function(userCheck) {
                if (userCheck)
                    return res.render('activation.ejs', {
                        error: 'Another account has been created with the ' +
                            'NetID ' + netid });

                // Save user as active.
                user.set('active', true);
                user.save().then(function() {

                    // Log in user.
                    req.login(user, function(err) {
                        if (err)
                            return res.json({ error: err });

                        res.render('activation.ejs', { error: null });
                    });
                });
            });
        });
    });

    // Route for polling if the user is authenticated yet.
    app.get('/api/poll-activation', function(req, res) {
        if (!req.isAuthenticated())
            return res.json({
                error: null,
                user: null
            });

        res.json({
            error: null,
            user: req.user.cleanOutput()
        });
    });

    // Route for logging out.
    app.post('/api/logout', function(req, res) {
        req.logout();
        res.send('ok');
    });
};

module.exports = authenticationrouter;

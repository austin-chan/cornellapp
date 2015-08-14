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
    var passport = app.get('passport');

    // Route for logging in.
    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            // Handle invalid authentications.
            if (err)
                return res.json({ error: err });

            req.login(user, function(err) {
                if (err)
                    return res.json({ error: err });

                return res.json({
                    error: null,
                    user: user.omit(['password', 'activation_key'])
                });
            });
        })(req, res, next);
    });

    // Route for signing up.
    app.post('/api/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            // Handle invalid authentications.
            if (err)
                return res.json({ error: err });

            req.logIn(user, function(err) {
                if (err)
                    return res.json({ error: err });

                return res.json({
                    error: null,
                    user: user.omit(['password', 'activation_key'])
                });
            });
        })(req, res, next);
    });

    // Route for logging out.
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

module.exports = authenticationrouter;

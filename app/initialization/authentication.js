/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Prepare all authentication processes for the application.
 */

var LocalStrategy = require('passport-local').Strategy;

var authentication = function(passport, models) {
    /**
     * Serialize the session user.
     */
    passport.serializeUser(function(user, done) {
        done(null, user.get('id'));
    });

    /**
     * Deserialize the session user.
     */
    passport.deserializeUser(function(id, done) {
        new models.user({ id: id }).fetch({
            withRelated: [
                'selections.course.groups.sections.meetings.professors'
            ]
        }).then(function(user) {
            done(null, user);
        });
    });

    /**
     * Set up the login strategy for authentication.
     */
    passport.use('local-login', new LocalStrategy({
        usernameField : 'netid',
        passwordField : 'password',
        passReqToCallback: true
    }, function(req, netid, password, done) {
        req.checkBody('netid', 'Provide a valid netID.').notEmpty()
            .isAlphanumeric();
        req.checkBody('password', 'Provide a password.').notEmpty();

        blockValidationErrors(req, done, function() {
            // Check that an activated or unactivated user exists with the
            // NetID.
            new models.user({ netid: netid }).fetch({
                withRelated: [
                    'selections.course.groups.sections.meetings.professors'
                ]
            }).then(function(user) {
                if (!user)
                    return done('The NetID you entered does not belong to any' +
                        ' account.');

                if (!user.correctPassword(password))
                    return done('The password does not match the account for ' +
                        'that NetID.');

                done(null, user);
            });
        });
    }));

    /**
     * Set up the signup strategy for authentication.
     */
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'netid',
        passwordField : 'password',
        passReqToCallback: true
    }, function(req, netid, password, done) {
        req.checkBody('netid', 'Provide a valid netID.').notEmpty()
            .isAlphanumeric();
        req.checkBody('password', 'Provide a password.').notEmpty();
        req.checkBody('name', 'Provide a name.').notEmpty();

        blockValidationErrors(req, done, function() {
            // Check that an activated user doesn't already exist with the
            // NetID.
            new models.user({ netid: netid, active: true }).fetch()
                .then(function(user) {
                if (user)
                    return done('An account is already associated with that ' +
                        'NetID.');

                // Create an unactivated user.
                new models.user({
                    netid: netid,
                    password: models.user.hashPassword(password),
                    name: req.body.name,
                    active: false,
                    activation_key: models.user.generateActivationKey(),
                }).save().then(function(user) {
                    done(null, user);
                });
            });
        });
    }));
};

/**
 * Call the callback function with an error parameter of the first validation
 * error string if there are any errors.
 * @param {object} req Request object to check validation errors for.
 * @param {object} done Callback function to run with error string as parameter.
 * @param {function} success Callback function to run if validation produced no
 *      errors.
 */
function blockValidationErrors(req, done, success) {
    var errors = req.validationErrors();
    if (errors)
        return done(errors[0].msg);

    success();
}

module.exports = authentication;

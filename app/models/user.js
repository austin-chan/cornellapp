/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for user.
 */

var randomstring = require('randomstring'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    config = require('../../config');
    _ = require('underscore');

var user = function(bookshelf, models) {
    return bookshelf.Model.extend({
        tableName: 'users',
        selections: function() {
            var strms = _.map(_.values(config.semesters), function(semester) {
                return semester.strm;
            });
            return this.hasMany(models.selection, 'userId').query('where',
                'strm', 'IN', strms);
        },

        /**
         * Output user attributes without sensitive data as JSON.
         * @return {object} Cleaned output.
         */
        cleanOutput: function() {
            return this.omit(['password', 'activation_key']);
        },

        /**
         * Determine if a string is the valid password for the user.
         * @param {string} password String to check against.
         */
        correctPassword: function(password) {
            return bcrypt.compareSync(password, this.get('password'));
        },

        /**
         * Send the user an activation email.
         * @param {object} config Config object necessary for sending the email
         *      with Amazon SES.
         * @param {function} callback Callback function to call when the email
         *      is sent.
         */
        sendActivationEmail: function(config, callback) {
            var transporter = nodemailer.createTransport(sesTransport(
                config.aws));

            transporter.sendMail({
                from: 'Cornellapp <' + config.mail.fromAddress + '>',
                to: this.get('netid') + '@cornell.edu',
                subject: '🍻 Please confirm your account',
                text: this.get('name') + ',\nPlease verify that you ' +
                    'have indeed signed up for an account on Cornellapp. ' +
                    'This is the last step of completing account signup. If ' +
                    'you wish to continue, please follow the link below:\n\n' +

                    config.site.domain + '/activate-user/' +
                        this.get('activation_key') + '/\n\n' +

                    'If you didn\'t request verification, please ignore this' +
                    ' email.\n\n' +
                    '🎉🎉🎉🎉\n' +
                    'Cornellapp'
            }, callback);
        },

        /**
         * Get course selection data for the user.
         * @return {object} Selection data for the user.
         */
        getSelectionData: function() {
            var selections = this.related('selections').toJSON(),
                semesters = _.values(config.semesters),
                data = {};

            // Loop through each active semester for the application.
            _.each(semesters, function(semester) {
                // Get only the selections for the semester
                var selectionsForSemester = _.filter(selections, function(s) {
                    return s.strm === semester.strm;
                });

                // Convert array to an object.
                selectionsForSemester = _.indexBy(selectionsForSemester, 'key');

                // Reformat to split course and selection.
                selectionsForSemester = _.mapObject(selectionsForSemester,
                    function(s) {

                    var course = s.course;
                    delete s.course;

                    // Decode the selected section IDs.
                    s.selectedSectionIds = JSON.parse(s.selectedSectionIds);
                    s.active = !!s.active;

                    return {
                        raw: course,
                        selection: s
                    };
                });

                data[semester.slug] = selectionsForSemester;
            });

            return data;
        }
    }, {
        /**
         * Generate a random string for identification for unactivated users to
         * activate their account using the activation key.
         * @return {string} Random activation key of length 32.
         */
        generateActivationKey: function() {
            return randomstring.generate();
        },

        /**
         * Generate a password hash for a password.
         * @return {string} Password hash.
         */
        hashPassword: function(password) {
            return bcrypt.hashSync(password, 8);
        }
    });
};

module.exports = user;

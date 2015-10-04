/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Configuration file for the application. Many important components rely on
 * node environment variables, see README.md for sufficient configuration
 * information.
 */

var config = {
    "knex": {
        "client": "mysql",
        "connection": {
            "host": process.env.DB_HOST,
            "user": process.env.DB_USER,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_DATABASE
        },
        "migrations": {
            "directory": "db/migrations"
        },
        "seeds": {
            "directory": "db/seeds"
        },
        // debug: true
    },
    "aws": {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        s3Bucket: process.env.AWS_S3BUCKET
    },
    "twilio": {
        'accountSID': process.env.TWILIO_ACCOUNTSID,
        'authToken': process.env.TWILIO_AUTHTOKEN,
        'number': process.env.TWILIO_PHONENUMBER
    },
    "mail": {
        fromAddress: process.env.MAIL_FROMADDRESS
    },
    "site": {
        domain: process.env.SITE_DOMAIN
    },
    "semester": "FA15",
    "semesters": {
        "FA15": {
            "slug": "FA15",
            "strm": 2608,
        }
    },
    "admins": [
        "adc237"
    ]
};

/**
 * Command line is running migrations on production.
 */
if (typeof process.env.NODE_ENV === 'undefined' && !process.env.DB_HOST) {
    console.log(process.env);
    // config.knex.connection = require('productionconfig');
}

module.exports = config;

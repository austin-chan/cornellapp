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
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    },
    "mail": {
        fromAddress: process.env.MAIL_FROMADDRESS
    },
    "site": {
        domain: process.env.SITE_DOMAIN
    },
    "semester": "FA15",
    "semesters": {
        "SU15": {
            "slug": "SU15",
            "strm": 2594,
            "descr": "Summer 2015"
        },
        "FA15": {
            "slug": "FA15",
            "strm": 2608,
            "descr": "Fall 2015"
        }
    },
    "admins": [
        "adc237"
    ]
};

module.exports = config;

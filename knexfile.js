/**
 * @fileoverview Knex module's config file. Config for the whole application
 * is abstracted into the config module, but since this file is required by
 * knex, the database config values are just copied below from the config
 * module.
 */

var config = require('config');

module.exports = {

  development: config.knex,
  production: config.knex

};

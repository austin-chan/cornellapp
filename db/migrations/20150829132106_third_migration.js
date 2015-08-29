'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('selections', function(table) {
            table.float('credits').notNullable().unsigned();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('selections', function(table) {
            table.dropColumn('credits');
        })
    ]);
};

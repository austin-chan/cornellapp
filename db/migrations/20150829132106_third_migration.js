'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('selections', function(table) {
            table.float('credits').notNullable().unsigned();
        }),
        knex.schema.createTable('events', function(table) {
            table.increments('id');
            table.integer('userId').unsigned();
            table.string('key', 16).notNullable();
            table.integer('strm').unsigned().notNullable();
            table.string('name').notNullable();
            table.string('startTime').notNullable();
            table.string('endTime').notNullable();
            table.string('color').notNullable();
            table.string('pattern').notNullable();
            table.boolean('active').notNullable();
            table.integer('credits').notNullable().unsigned();
            table.string('location').notNullable();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('selections', function(table) {
            table.dropColumn('credits');
        }),
        knex.schema.dropTable('events'),
    ]);
};

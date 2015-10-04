'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('schedules', function(table) {
            table.string('id').notNullable();
            table.string('semester').notNullable();
            table.integer('userId').unsigned().notNullable();
        }),
        knex.schema.table('users', function(table) {
            table.integer('private').unsigned().notNullable();
            table.integer('texts').unsigned().notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('schedules'),
        knex.schema.table('users', function(table) {
            table.dropColumn('private');
            table.dropColumn('texts');
        }),
    ]);
};

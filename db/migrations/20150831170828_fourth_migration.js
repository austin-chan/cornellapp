'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('comments', function(table) {
            table.string('id').notNullable();
            table.integer('crseId').unsigned().notNullable();
            table.dateTime('created').notNullable();
            table.integer('userId').unsigned();
            table.string('message').notNullable();
        }),
        knex.schema.createTable('ratings', function(table) {
            table.increments('id');
            table.integer('crseId').unsigned().notNullable();
            table.integer('userId').unsigned();
            table.integer('value').notNullable();
        }),
        knex.schema.createTable('upvotes', function(table) {
            table.increments('id');
            table.string('comment_id').notNullable();
            table.integer('userId').unsigned();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('comments'),
        knex.schema.dropTable('ratings'),
        knex.schema.dropTable('upvotes'),
    ]);
};

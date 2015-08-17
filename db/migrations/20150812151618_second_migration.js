'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('selections', function(table) {
            table.increments('id');
            table.string('tag').notNullable(); // crseId + strm + subject
            table.integer('userId').unsigned();
            table.string('key', 16).notNullable();
            table.integer('strm').unsigned().notNullable();
            table.string('color').notNullable();
            table.boolean('active').notNullable();
            table.string('selectedSectionIds').notNullable();
        }),
        knex.schema.createTable('likes', function(table) {
            table.increments('id');
            table.string('crseId_subject').notNullable();
            table.integer('userId').unsigned().notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('selections'),
        knex.schema.dropTable('likes'),
    ]);
};

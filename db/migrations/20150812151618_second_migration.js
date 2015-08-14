'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('selections', function(table) {
            table.increments().unsigned();
            table.integer('userId').unsigned();
            table.integer('crseId').unsigned().notNullable();
            table.integer('strm').notNullable();
            table.string('key', 16).notNullable();
            table.string('color').notNullable();
            table.boolean('active').notNullable();
            table.string('selectedSectionIds').notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('selections')
    ]);
};

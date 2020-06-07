import Knex from 'knex';

export async function up(knex: Knex) {
    // CRIAR TABELA
    return knex.schema.createTable('spot_items', table => {
        table.increments('id').primary();

        table.integer('spot_id')
            .notNullable()
            .references('id')
            .inTable('spots');

        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items');
       
    });
}

export async function down(knex: Knex) {
    // VOLTAR ATRAS (DELETAR A TABELA)
    return knex.schema.dropTable('spot_items');
}
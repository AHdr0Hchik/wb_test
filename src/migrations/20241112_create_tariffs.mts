import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tariffs', (table) => {
        table.increments('id').primary();
        table.date('date').notNullable();
        table.integer('warehouse_id').notNullable();
        table.string('warehouse_name').notNullable();
        table.decimal('coefficient', 10, 2).notNullable();
        table.decimal('box_delivery_base', 10, 2).notNullable();
        table.decimal('box_delivery_liter', 10, 2).notNullable();
        table.decimal('box_storage_base', 10, 2).notNullable();
        table.decimal('box_storage_liter', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

        // Создаем уникальный составной индекс
        table.unique(['date', 'warehouse_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('tariffs');
}
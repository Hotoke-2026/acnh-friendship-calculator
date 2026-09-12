/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable('clothes', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('category').notNullable() // 'Top', 'Bottom', 'Dress', 'Accessory', 'Headwear'
      table.string('color1').notNullable()    // e.g., 'Red', 'Blue', 'Black'
      table.string('color2')
      table.string('style1').notNullable()    // 'Cool', 'Cute', 'Elegant', 'Gorgeous', 'Active', 'Simple'
      table.string('style2')
      table.integer('sell_value').notNullable()
    })
    .createTable('user_clothes', (table) => {
      table.increments('id').primary()
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('clothing_id').references('id').inTable('clothes').onDelete('CASCADE')
      table.unique(['user_id', 'clothing_id'])
    })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('user_clothes').dropTableIfExists('clothes')
};

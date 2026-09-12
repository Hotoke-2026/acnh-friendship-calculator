export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id').primary()
    table.string('email').notNullable()
    table.timestamps(true, true)
  })
    .createTable('villagers', (table) => {
      table.increments('id').primary()
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.integer('friendship_points').defaultTo(25) // All villagers start with 25 points when they move onto island.
      table.boolean('is_last_moved_in').defaultTo(false)
      table.boolean('is_last_asked_to_stay').defaultTo(false)
      table.boolean('is_house_relocating').defaultTo(false)
      table.date('birthday')
      table.timestamps(true, true)
    })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('villagers')
}

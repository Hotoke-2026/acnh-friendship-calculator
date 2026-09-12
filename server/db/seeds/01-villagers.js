export async function seed(knex) {
  // Clear existing entries
  await knex('villagers').del()
    .then(() => knex('users').del())

  // Insert mock Auth0 users
  await knex('users').insert([
    {
      id: 'auth0|65a1b2c3d4e5f60011223344',
      email: 'island.representative@example.com'
    },
    {
      id: 'google-oauth2|109876543210987654321',
      email: 'villager.fan@example.com'
    }
  ])

  // Insert villagers across different friendship levels & move-out exclusion states
  await knex('villagers').insert([
    {
      id: 1,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Muffy',
      friendship_points: 200, // Level 6: Secret greeting unlocked
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-02-14'
    },
    {
      id: 2,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Megan',
      friendship_points: 155, // Level 5: Framed photo eligible
      is_last_moved_in: true, // Move-out excluded (last moved in)
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-03-13'
    },
    {
      id: 3,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Bruce',
      friendship_points: 65,  // Level 3: Nicknames unlocked
      is_last_moved_in: false,
      is_last_asked_to_stay: true, // Move-out excluded (asked to stay)
      is_house_relocating: false,
      birthday: '2026-05-26'
    },
    {
      id: 4,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Teddy',
      friendship_points: 25,  // Level 1: Default baseline
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: true, // Move-out excluded (relocating)
      birthday: '2026-09-26'
    },
    {
      id: 5,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Zucker',
      friendship_points: 110, // Level 4: Catchphrase changes
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-03-08'
    },
    {
      id: 6,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Coco',
      friendship_points: 180,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-03-01'
    },
    {
      id: 7,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Merengue',
      friendship_points: 140,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-03-19'
    },
    {
      id: 8,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Pietro',
      friendship_points: 85,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-04-19'
    },
    {
      id: 9,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Zell',
      friendship_points: 120,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-06-07'
    },
    {
      id: 10,
      user_id: 'auth0|65a1b2c3d4e5f60011223344',
      name: 'Ankha',
      friendship_points: 220,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-09-22'
    }
  ])
}
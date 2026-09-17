export async function seed(knex) {
  await knex('villagers').del()
    .then(() => knex('users').del())

  await knex('users').insert([
    {
      id: 'google-oauth2|112146994576105378540',
      email: 'kinosj74@gmail.com'
    },
  ])

  await knex('villagers').insert([
    {
      id: 1,
      user_id: 'google-oauth2|112146994576105378540',
      name: 'Muffy',
      friendship_points: 200,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: false,
      birthday: '2026-02-14',
      imageUrl: 'https://dodo.ac/np/images/7/73/Muffy_NH_Villager_Icon.png'
    },
    {
      id: 3,
      user_id: 'google-oauth2|112146994576105378540',
      name: 'Bruce',
      friendship_points: 65,
      is_last_moved_in: false,
      is_last_asked_to_stay: true,
      is_house_relocating: false,
      birthday: '2026-05-26',
      imageUrl: 'https://dodo.ac/np/images/9/9b/Bruce_NH_Villager_Icon.png'
    },
    {
      id: 4,
      user_id: 'google-oauth2|112146994576105378540',
      name: 'Teddy',
      friendship_points: 25,
      is_last_moved_in: false,
      is_last_asked_to_stay: false,
      is_house_relocating: true,
      birthday: '2026-09-26',
      imageUrl: 'https://dodo.ac/np/images/b/bd/Teddy_NH_Villager_Icon.png'
    }
  ])
}
import request from 'superagent'
import { Villager, InteractionPayload } from '../components/models/villager'

export async function fetchVillagers(token: string): Promise<Villager[]> {
  const res = await request
    .get('/api/v1/villagers')
    .set('Authorization', `Bearer ${token}`)
  return res.body
}

export async function interactWithVillager(
  name:string,
  payload: InteractionPayload,
  token: string
): Promise<Villager> {
  const res = await request
    .post(`/api/v1/villagers/${name}/interact`)
    .set('Authorization', `Bearer ${token}`)
    .send(payload)
  return res.body
}
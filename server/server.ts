import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'node:path'
import { auth } from 'express-oauth2-jwt-bearer'
import villagersRouter from './routes/villagers'
import nookipediaRouter from './routes/nookipedia'

const server = express()

server.use(express.json())

const checkJwt = auth({
  audience: 'https://api.animalfriendship.com',
  issuerBaseURL: 'https://hotoke2026-levi.au.auth0.com/',
  tokenSigningAlg: 'RS256',
})

server.use('/api/v1/villagers', checkJwt, villagersRouter)
server.use('/api/v1/nookipedia', checkJwt, nookipediaRouter)

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve('dist')
  server.use(express.static(clientPath))
  server.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'))
  })
}

export default server

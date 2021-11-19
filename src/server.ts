import express, { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { Ingest, Search } from 'sonic-channel'

const server = express()

server.use(express.json())

const sonicChannelIngest = new Ingest({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword'
})

const sonicChannelSearch = new Search({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword'
})

sonicChannelIngest.connect({
  connected: () => {
    console.log('🔦 Sonic Ingest running!')
  }
})

sonicChannelSearch.connect({
  connected: () => {
    console.log('🔦 Sonic Search running!')
  }
})

server.post('/pages', async (request: Request, response: Response) => {
  const { title, content } = request.body

  const id = uuid()

  await sonicChannelIngest.push('pages', 'default', `page:${id}`, `${title} ${content}`, {
    lang: 'por'
  })

  return response.status(200).send()
})

server.get('/search', async (request: Request, response: Response) => {
  const { q } = request.query

  const results = await sonicChannelSearch.query('pages', 'default', q as string, {
    lang: 'por'
  })

  return response.json(results)
})

server.post('/suggest', async (request: Request, response: Response) => {
  const { q } = request.query

  const results = await sonicChannelSearch.query('pages', 'default', q as string, {
    limit: 5
  })

  return response.json(results)
})

server.listen(3333, () => {
  console.log('🚀 Server running on port 3333!')
})
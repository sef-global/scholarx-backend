import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let userAgent: supertest.SuperAgentTest

describe('Category route', () => {
  beforeAll(async () => {
    server = await startServer(port)
    userAgent = supertest.agent(server)
  }, 5000)

  it('should return all categories and a success message', async () => {
    const response = await userAgent.get(`/api/categories`).expect(200)

    expect(response.body).toHaveProperty('categories')
  })
})

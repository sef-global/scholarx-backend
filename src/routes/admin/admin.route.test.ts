import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../entities/profile.entity'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

const randomString = Math.random().toString(36)
let server: Express
let agent: supertest.SuperAgentTest

describe('Get all users route', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)

    const testUser = {
      email: `test${randomString}@gmail.com`,
      password: '123'
    }

    await supertest(server)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201)

    await agent.post('/api/auth/login').send(testUser).expect(200)
  }, 5000)

  it('should return a 401 when a valid access token is not provided', async () => {
    await supertest(server).get('/api/admin/users').expect(401)
  })

  it('should return a 200 with all users from the DB', async () => {
    const response = await agent.get('/api/admin/users').expect(200)

    const userProfiles = response.body.profiles

    userProfiles.forEach((userProfile: Partial<Profile>) => {
      expect(userProfile).toHaveProperty('created_at')
      expect(userProfile).toHaveProperty('updated_at')
      expect(userProfile).toHaveProperty('primary_email')
      expect(userProfile).toHaveProperty('contact_email')
      expect(userProfile).toHaveProperty('first_name')
      expect(userProfile).toHaveProperty('last_name')
      expect(userProfile).toHaveProperty('image_url')
      expect(userProfile).toHaveProperty('linkedin_url')
      expect(userProfile).toHaveProperty('type')
      expect(userProfile).toHaveProperty('uuid')
      expect(userProfile).not.toHaveProperty('password')
    })
  })
})

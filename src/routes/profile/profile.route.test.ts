import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'

const randomString = Math.random().toString(36)
const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest

describe('profile', () => {
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

  describe('Get profile route', () => {
    it('should return a 200 with a user profile object', async () => {
      const response = await agent.get('/api/me/profile').expect(200)

      expect(response.body).toHaveProperty('created_at')
      expect(response.body).toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('primary_email')
      expect(response.body).toHaveProperty('contact_email')
      expect(response.body).toHaveProperty('first_name')
      expect(response.body).toHaveProperty('last_name')
      expect(response.body).toHaveProperty('image_url')
      expect(response.body).toHaveProperty('linkedin_url')
      expect(response.body).toHaveProperty('type')
      expect(response.body).toHaveProperty('uuid')
      expect(response.body).not.toHaveProperty('password')
    })
  })

  describe('Update profile route', () => {
    it('should update the user profile and return a 200', async () => {
      const updatedProfile = {
        contact_email: 'test_contact@example.com',
        first_name: 'John',
        last_name: 'Doe',
        image_url: 'https://example.com/test_profile_image.jpg',
        linkedin_url: 'https://www.linkedin.com/in/johndoe'
      }

      await agent.put('/api/me/profile').send(updatedProfile).expect(200)
    })
    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).put('/api/me/profile').send({}).expect(401)
    })
  })
  describe('Delete profile route', () => {
    it('should delete the user profile and return a 200', async () => {
      await agent.delete('/api/me/profile').expect(200)
    })

    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).delete(`/api/me/profile`).send({}).expect(401)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
  })
})

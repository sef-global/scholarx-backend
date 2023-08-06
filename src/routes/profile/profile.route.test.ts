import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'

const randomString = Math.random().toString(36)
let server: Express
let accessToken: string

describe('profile', () => {
  beforeAll(async () => {
    server = await startServer()

    const testUser = {
      email: `test${randomString}@gmail.com`,
      password: '123'
    }

    await supertest(server)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201)

    const response = await supertest(server)
      .post('/api/auth/login')
      .send(testUser)
      .expect(200)

    accessToken = response.body.token
  }, 5000)

  describe('Get profile route', () => {
    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).get('/api/me/profile').expect(401)
    })

    it('should return a 200 with a user profile object', async () => {
      const response = await supertest(server)
        .get('/api/me/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

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

      await supertest(server)
        .put('/api/me/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedProfile)
        .expect(200)
    })

    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).put('/api/me/profile').send({}).expect(401)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
  })
})

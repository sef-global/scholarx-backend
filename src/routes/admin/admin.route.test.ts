import type { Express } from 'express'
import supertest from 'supertest'

let server: Express
let accessToken: string

describe('Get all users route', () => {
  it('should return a 401 when a valid access token is not provided', async () => {
    await supertest(server).get('/api/admin/users').expect(401)
  })

  it('should return a 200 with all users from the DB', async () => {
    const response = await supertest(server)
      .get('/api/me/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    const userProfiles = response.body

    userProfiles.forEach((userProfile: Object) => {
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

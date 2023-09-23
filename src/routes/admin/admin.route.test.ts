import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { dataSource } from '../../configs/dbConfig'
import bcrypt from 'bcrypt'
import { mockAdmin, mockUser } from '../../../mocks'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000
let server: Express
let agent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest

describe('Get all users route', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)
    adminAgent = supertest.agent(server)

    const defaultUser = {
      ...mockUser
    }

    await supertest(server)
      .post('/api/auth/register')
      .send(defaultUser)
      .expect(201)

    await agent.post('/api/auth/login').send(defaultUser).expect(200)

    const adminUser = {
      ...mockAdmin
    }

    const profileRepository = dataSource.getRepository(Profile)

    const hashedPassword = await bcrypt.hash(adminUser.password, 10)
    const newProfile = profileRepository.create({
      primary_email: adminUser.email,
      password: hashedPassword,
      contact_email: '',
      first_name: '',
      last_name: '',
      image_url: '',
      linkedin_url: '',
      type: ProfileTypes.ADMIN
    })

    await profileRepository.save(newProfile)

    await adminAgent.post('/api/auth/login').send(adminUser).expect(200)
  }, 5000)

  it('should return a 401 when a valid access token is not provided', async () => {
    await supertest(server).get('/api/admin/users').expect(401)
  })

  it('should return a 403 if user is not admin', async () => {
    await agent.get('/api/admin/users').expect(403)
  })

  it('should return a 200 with all users if user is admin', async () => {
    const response = await adminAgent.get('/api/admin/users').expect(200)

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

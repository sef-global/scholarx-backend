import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { mockAdmin, mockUser, platformInfo } from '../../../../mocks'
import { ProfileTypes } from '../../../enums'
import { dataSource } from '../../../configs/dbConfig'
import Profile from '../../../entities/profile.entity'
import type Platform from '../../../entities/platform.entity'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let savedPlatformUUID: string

describe('Admin platform routes', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)
    adminAgent = supertest.agent(server)

    await supertest(server)
      .post('/api/auth/register')
      .send(mockUser)
      .expect(201)
    await agent.post('/api/auth/login').send(mockUser).expect(200)

    const profileRepository = dataSource.getRepository(Profile)

    const hashedPassword = await bcrypt.hash(mockAdmin.password, 10)
    const newProfile = profileRepository.create({
      primary_email: mockAdmin.email,
      password: hashedPassword,
      contact_email: '',
      first_name: '',
      last_name: '',
      image_url: '',
      linkedin_url: '',
      type: ProfileTypes.ADMIN
    })

    await profileRepository.save(newProfile)

    await adminAgent.post('/api/auth/login').send(mockAdmin).expect(200)
  }, 5000)

  it('should add a platform', async () => {
    const platformDetails = await adminAgent
      .post('/api/admin/platform')
      .send(platformInfo)
      .expect(201)

    savedPlatformUUID = await platformDetails.body.platform.uuid
  })

  it('should only allow admins to add a platform', async () => {
    await agent.post('/api/admin/categories').send(platformInfo).expect(403)
  })

  it('should return a 200 with platform details if user is admin', async () => {
    const response = await adminAgent.get('/api/admin/platform').expect(200)

    const platformDetails = response.body.platform

    platformDetails.forEach((platform: Platform) => {
      expect(platform).toHaveProperty('description')
      expect(platform).toHaveProperty('mentor_questions')
      expect(platform).toHaveProperty('image_url')
      expect(platform).toHaveProperty('landing_page_url')
      expect(platform).toHaveProperty('email_templates')
      expect(platform).toHaveProperty('title')
      expect(platform).toHaveProperty('uuid')
    })
  })

  it('should only allow admins to get a platform', async () => {
    await agent.get('/api/admin/platform').expect(403)
  })

  it('should should be able to update the platform details and return a 200', async () => {
    await adminAgent
      .put('/api/admin/platform')
      .send({
        ...platformInfo,
        uuid: savedPlatformUUID
      })
      .expect(200)
  })

  it('should return a 404 when invalid platform uuid is sent', async () => {
    await adminAgent
      .put('/api/admin/platform')
      .send({
        ...platformInfo,
        uuid: '0058ab92-1c82-4af1-9f84-c60a3e922244'
      })
      .expect(404)
  })

  it('should only allow admins to update platform', async () => {
    await agent
      .put('/api/admin/platform')
      .send({
        ...platformInfo,
        uuid: savedPlatformUUID
      })
      .expect(403)
  })
})

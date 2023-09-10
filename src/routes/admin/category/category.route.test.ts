import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../../entities/profile.entity'
import { ProfileTypes } from '../../../enums'
import { dataSource } from '../../../configs/dbConfig'
import bcrypt from 'bcrypt'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

const randomString = Math.random().toString(36)
const randomStringAdmin = Math.random().toString(36)
let server: Express
let agent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest

describe('Admin category routes', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)
    adminAgent = supertest.agent(server)

    const defaultUser = {
      email: `test${randomString}@gmail.com`,
      password: '123'
    }

    await supertest(server)
      .post('/api/auth/register')
      .send(defaultUser)
      .expect(201)

    await agent.post('/api/auth/login').send(defaultUser).expect(200)

    const adminUser = {
      email: `test${randomStringAdmin}@gmail.com`,
      password: 'admin123'
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

  it('should add a category', async () => {
    await adminAgent
      .post('/api/admin/categories')
      .send({ categoryName: 'Computer Science' })
      .expect(200)
  })

  it('should only allow admins to add a category', async () => {
    await agent
      .post('/api/admin/categories')
      .send({ categoryName: 'Computer Science' })
      .expect(403)
  })
})

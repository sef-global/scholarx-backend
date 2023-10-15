import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { emailTemplateInfo, mockAdmin, mockUser } from '../../../../mocks'
import { dataSource } from '../../../configs/dbConfig'
import Profile from '../../../entities/profile.entity'
import { ProfileTypes } from '../../../enums'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest

describe('Admin email template routes', () => {
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

  it('should add a email template', async () => {
    await adminAgent
      .post('/api/admin/emails/templates')
      .send({ ...emailTemplateInfo, recipient: mockUser.email })
      .expect(201)
  })

  it('should only allow admins to add a email template', async () => {
    await agent
      .post('/api/admin/emails/templates')
      .send({ ...emailTemplateInfo, recipient: mockUser.email })
      .expect(403)
  })
})

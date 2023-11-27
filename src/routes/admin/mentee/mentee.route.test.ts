import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { mockAdmin, mockUser } from '../../../../mocks'
import { dataSource } from '../../../configs/dbConfig'
import Profile from '../../../entities/profile.entity'
import { ProfileTypes } from '../../../enums'
import type EmailTemplate from '../../../entities/emailTemplate.entity'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let savedEmailTemplate: EmailTemplate

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

  it('should get all mentee emails with status approved', async () => {
    const response = await adminAgent
      .get('/api/admin/mentee/emails?status=approved')
      .expect(200)

    const { emails, message } = response.body
    expect(emails).toBeInstanceOf(Array)
    expect(message).toContain('All mentee emails with status approved')
  })

  it('should get all mentee emails with status rejected', async () => {
    const response = await adminAgent
      .get('/api/admin/mentee/emails?status=rejected')
      .expect(200)

    const { emails, message } = response.body
    expect(emails).toBeInstanceOf(Array)
    expect(message).toContain('All mentee emails with status rejected')
  })

  it('should get all mentee emails with status pending', async () => {
    const response = await adminAgent
      .get('/api/admin/mentee/emails?status=pending')
      .expect(200)

    const { emails, message } = response.body
    expect(emails).toBeInstanceOf(Array)
    expect(message).toContain('All mentee emails with status pending')
  })

  it('should get all mentee emails with status pending', async () => {
    const response = await adminAgent
      .get('/api/admin/mentee/emails?status=wrongstatus')
      .expect(400)
  })
})

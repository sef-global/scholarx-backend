import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../../entities/profile.entity'
import { ProfileTypes } from '../../../enums'
import { dataSource } from '../../../configs/dbConfig'
import bcrypt from 'bcrypt'
import Category from '../../../entities/category.entity'
import { mentorApplicationInfo } from '../../../../mocks'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

const randomString = Math.random().toString(36)
const randomStringAdmin = Math.random().toString(36)
let server: Express
let mentorAgent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let mentorId: string

describe('Admin mentor routes', () => {
  beforeAll(async () => {
    server = await startServer(port)
    mentorAgent = supertest.agent(server)
    adminAgent = supertest.agent(server)

    const mentor = {
      email: `mentor${randomString}@gmail.com`,
      password: '123'
    }

    await mentorAgent.post('/api/auth/register').send(mentor).expect(201)
    await mentorAgent.post('/api/auth/login').send(mentor).expect(200)

    const categoryRepository = dataSource.getRepository(Category)
    const newCategory = new Category('Computer Science', [])
    const category = await categoryRepository.save(newCategory)

    const response = await mentorAgent
      .post('/api/mentors')
      .send({ ...mentorApplicationInfo, categoryId: category.uuid })
      .expect(201)

    mentorId = response.body.mentor.uuid

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

  it('should update the mentor application state', async () => {
    await adminAgent
      .put(`/api/admin/mentors/${mentorId}/status`)
      .send({ status: 'approved' })
      .expect(200)
  })

  it('should return 400 when an invalid status was provided', async () => {
    await adminAgent
      .put(`/api/admin/mentors/${mentorId}/status`)
      .send({ status: 'invalid status' })
      .expect(400)
  })

  it('should only allow admins to update the status', async () => {
    await mentorAgent
      .put(`/api/admin/mentors/${mentorId}/status`)
      .send({ status: 'approved' })
      .expect(403)
  })
})

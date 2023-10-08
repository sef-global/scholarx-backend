import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../../entities/profile.entity'
import { ApplicationStatus, ProfileTypes } from '../../../enums'
import { dataSource } from '../../../configs/dbConfig'
import bcrypt from 'bcrypt'
import { mentorApplicationInfo, mockAdmin, mockMentor } from '../../../../mocks'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let mentorAgent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let mentorId: string

describe('Admin mentor routes', () => {
  beforeAll(async () => {
    server = await startServer(port)
    mentorAgent = supertest.agent(server)
    adminAgent = supertest.agent(server)

    await mentorAgent.post('/api/auth/register').send(mockMentor).expect(201)
    await mentorAgent.post('/api/auth/login').send(mockMentor).expect(200)

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
    const categoryResponse = await adminAgent
      .post('/api/admin/categories')
      .send({ categoryName: 'Computer Science' })
      .expect(201)

    const response = await mentorAgent
      .post('/api/mentors')
      .send({
        ...mentorApplicationInfo,
        categoryId: categoryResponse.body.category.uuid
      })
      .expect(201)

    mentorId = response.body.mentor.uuid
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

  it('should return mentors and a success message when mentors are found', async () => {
    const response = await adminAgent
      .get(`/api/admin/mentors?status=${ApplicationStatus.APPROVED}`)
      .expect(200)

    expect(response.body).toHaveProperty('mentors')
  })

  it('should only allow admins to get the mentors', async () => {
    await mentorAgent
      .get(`/api/admin/mentors?status=${ApplicationStatus.APPROVED}`)
      .expect(403)
  })

  it('should return mentors and a success message when mentors are found', async () => {
    const response = await adminAgent.get(`/api/admin/mentors`).expect(200)

    expect(response.body).toHaveProperty('mentors')
  })
})

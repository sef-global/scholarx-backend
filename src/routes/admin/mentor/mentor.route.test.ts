import { startServer } from '../../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import Profile from '../../../entities/profile.entity'
import { ApplicationStatus, ProfileTypes } from '../../../enums'
import { dataSource } from '../../../configs/dbConfig'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { mentorApplicationInfo, mockAdmin, mockMentor } from '../../../../mocks'
import type Category from '../../../entities/category.entity'
import type Mentor from '../../../entities/mentor.entity'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let mentorAgent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let mentorId: string
let mentorProfileId: string
let category: Category

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
    mentorProfileId = response.body.mentor.profile.uuid
    category = categoryResponse.body.category
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

  it('should return mentors emails and a success message when mentors emails are found', async () => {
    const response = await adminAgent
      .get(`/api/admin/mentors/emails?status=${ApplicationStatus.APPROVED}`)
      .expect(200)

    expect(response.body).toHaveProperty('emails')
  })

  it('should return mentors emails without status parameter and a success message when mentors emails are found', async () => {
    const response = await adminAgent
      .get(`/api/admin/mentors/emails?status=`)
      .expect(200)

    expect(response.body).toHaveProperty('emails')
  })

  it('should only allow admins to get the mentors', async () => {
    await mentorAgent
      .get(`/api/admin/mentors/emails?status=${ApplicationStatus.APPROVED}`)
      .expect(403)
  })

  it.each([true, false])(
    'should update mentor availability and return a 201 with the updated availability',
    async (availability) => {
      const response = await adminAgent
        .put(`/api/admin/mentors/${mentorProfileId}/availability`)
        .send({ availability })
        .expect(200)

      const mentor = response.body.updatedMentorApplication

      expect(mentor).toHaveProperty('availability', availability)
    }
  )

  it.each([true, false])(
    'should only allow admins to update the mentor availability',
    async (availability) => {
      await mentorAgent
        .put(`/api/admin/mentors/${mentorProfileId}/availability`)
        .send({ availability })
        .expect(403)
    }
  )

  it.each([true, false])(
    'should return no mentor found',
    async (availability) => {
      const nonExistentMentorId = uuidv4()
      await adminAgent
        .put(`/api/admin/mentors/${nonExistentMentorId}/availability`)
        .send({ availability })
        .expect(404)
    }
  )

  it('should return mentors first name starts with john and a success message when mentors are found', async () => {
    const updatedProfile = {
      contact_email: 'test_contact@example.com',
      first_name: 'John',
      last_name: 'Doe',
      image_url: 'https://example.com/test_profile_image.jpg',
      linkedin_url: 'https://www.linkedin.com/in/johndoe'
    }

    await mentorAgent.put('/api/me/profile').send(updatedProfile).expect(200)

    const response = await adminAgent
      .get(`/api/admin/mentors/search?q=john`)
      .expect(200)

    expect(response.body).toHaveProperty('mentors')
  })

  it('should only allow admins to search mentors', async () => {
    await mentorAgent.get(`/api/admin/mentors/search?q=john`).expect(403)
  })

  it('should return mentors category starts with Computer and a success message when mentors by category are found', async () => {
    const response = await adminAgent
      .get(`/api/admin/mentors/category?category=${category.category}`)
      .expect(200)

    const mentorDetails = response.body.mentors

    mentorDetails.forEach((mentor: Mentor) => {
      expect(mentor).toHaveProperty('profile')
      expect(mentor).toHaveProperty('application')
      expect(mentor).toHaveProperty('category')
    })
  })

  it('should only allow admins to search mentors by category', async () => {
    await mentorAgent
      .get(`/api/admin/mentors/category?category=${category.category}`)
      .expect(403)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })
})

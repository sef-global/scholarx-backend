import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'
import { mockAdmin, mockMentor, mentorApplicationInfo } from '../../../mocks'
import bcrypt from 'bcrypt'
import Profile from '../../entities/profile.entity'
import { ApplicationStatus, ProfileTypes } from '../../enums'
import { getAllMentors } from './mentor.service'
import type { AllMentorsArray } from '../../types'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let mentorAgent: supertest.SuperAgentTest
let adminAgent: supertest.SuperAgentTest
let mentorId: string

describe('getAllMentors function', () => {
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

  it('should return mentorsArray and a success message when mentors are found', async () => {
    const { mentors, statusCode, message } = await getAllMentors(
      ApplicationStatus.APPROVED
    )

    expect(statusCode).toBe(200)
    mentors?.forEach((mentor: AllMentorsArray) => {
      expect(mentor).toHaveProperty('created_at')
      expect(mentor).toHaveProperty('updated_at')
      expect(mentor).toHaveProperty('category')
      expect(mentor).toHaveProperty('application')
      expect(mentor).toHaveProperty('profile')
      expect(mentor).toHaveProperty('state')
      expect(mentor).toHaveProperty('availability')
      expect(mentor).toHaveProperty('mentor_id')
    })
    expect(message).toBe('All Mentors found')
  })
})

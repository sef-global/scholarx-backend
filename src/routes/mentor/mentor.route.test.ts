import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'
import { mentorApplicationInfo, mockUser } from '../../../mocks'
import { v4 as uuidv4 } from 'uuid'
import Category from '../../entities/category.entity'
import type Mentor from '../../entities/mentor.entity'

const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest
let savedCategory: Category
let savedMentor: Mentor

describe('Mentor application', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)

    await supertest(server)
      .post('/api/auth/register')
      .send(mockUser)
      .expect(201)

    await agent.post('/api/auth/login').send(mockUser).expect(200)

    const categoryRepository = dataSource.getRepository(Category)
    const newCategory = new Category('Random Category', [])
    savedCategory = await categoryRepository.save(newCategory)
  }, 5000)

  describe('Apply as a mentor route', () => {
    it('should return a 201 with a mentor and the message', async () => {
      const response = await agent
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: savedCategory.uuid })
        .expect(201)

      expect(response.body).toHaveProperty('mentor')
      expect(response.body).toHaveProperty('message')
      savedMentor = response.body.mentor
    })

    it('should return a 409 when the user is already a mentor or has an pending invitation', async () => {
      const response = await agent
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: savedCategory.uuid })
        .expect(409)

      expect(response.body).toHaveProperty('mentor')
      expect(response.body).toHaveProperty('message')
    })

    it('should return a 404 when the category id is not valid', async () => {
      await agent
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: uuidv4() })
        .expect(404)
    })

    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).post('/api/mentors').send({}).expect(401)
    })
  })

  describe('Get mentor details route', () => {
    it('should return a 200 with the mentor details', async () => {
      const response = await agent
        .get(`/api/mentors/${savedMentor.uuid}`)
        .expect(200)

      expect(response.body).toHaveProperty('mentorId')
      expect(response.body).toHaveProperty('category')
      expect(response.body).toHaveProperty('profile')
    })

    it('should return a 404 when the mentor ID is not found', async () => {
      const nonExistentId = uuidv4()
      await agent.get(`/api/mentors/${nonExistentId}`).expect(404)
    })

    describe('Update Mentor Availability', () => {
      it.each([true, false])(
        'should update mentor availability and return a 201 with the updated availability',
        async (availability) => {
          const response = await agent
            .put('/api/mentors/me/availability')
            .send({ availability })
            .expect(200)

          expect(response.body).toHaveProperty('availability', availability)
        }
      )
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
  })
})

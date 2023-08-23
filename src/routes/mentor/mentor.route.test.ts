import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'
import { mentorApplicationInfo } from '../../../mocks'
import { v4 as uuidv4 } from 'uuid'
import Category from '../../entities/category.entity'

const randomString = Math.random().toString(36)
const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest
let savedCategory: Category

describe('Mentor application', () => {
  beforeAll(async () => {
    server = await startServer(port)
    agent = supertest.agent(server)

    const testUser = {
      email: `test${randomString}@gmail.com`,
      password: '123'
    }

    await supertest(server)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201)

    await agent.post('/api/auth/login').send(testUser).expect(200)

    const categoryRepository = dataSource.getRepository(Category)
    const newCategory = new Category('Random Category', [])
    savedCategory = await categoryRepository.save(newCategory)
  }, 5000)

  describe('Apply as a mentor route', () => {
    it('should return a 200 with a mentor object and the message', async () => {
      const response = await agent
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: savedCategory.uuid })
        .expect(200)

      expect(response.body).toHaveProperty('mentor')
      expect(response.body).toHaveProperty('message')
    })

    it('should return a 409 when the user is already a mentor or has an pending invitation', async () => {
      const response = await supertest(server)
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: savedCategory.uuid })
        .expect(409)

      expect(response.body).toHaveProperty('mentor')
      expect(response.body).toHaveProperty('message')
    })

    it('should return a 404 when the category id is not valid', async () => {
      await supertest(server)
        .post('/api/mentors')
        .send({ ...mentorApplicationInfo, categoryId: uuidv4() })
        .expect(401)
    })

    it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).post('/api/mentors').send({}).expect(401)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
  })
})

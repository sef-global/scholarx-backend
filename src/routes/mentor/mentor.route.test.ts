import { startServer } from '../../app'
import type { Express } from 'express'
import supertest from 'supertest'
import { dataSource } from '../../configs/dbConfig'

const randomString = Math.random().toString(36)
const port = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000

let server: Express
let agent: supertest.SuperAgentTest

describe('Register and login', () => {
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
  }, 5000)

  describe('Create mentor route', () => {
    it('should return a 200 with a mentor object and the message', async () => {
			const mentorInfo = {
				"application": [
					{
						"question": "What is your country?",
						"answers": "Singapore"
					},
					{
						"question": "What is your expertise?",
						"answers": "Software Engineering"
					},
					{
						"question": "What is your mentoring startegy?",
						"answers": "I will provide my insights"
					}
				],
				"categoryId": "60b5b847-99a2-4e47-b35b-81b4284311dd"
			}

      const response = await agent.post('/api/mentors').send(mentorInfo).expect(200)

			expect(response.body).toHaveProperty('mentor')
      expect(response.body).toHaveProperty('message')
    })

		it('should return a 409 when the user is already a mentor or has an pending invitation', async () => {
			const mentorInfo = {
				"application": [
					{
						"question": "What is your country?",
						"answers": "Singapore"
					},
					{
						"question": "What is your expertise?",
						"answers": "Software Engineering"
					},
					{
						"question": "What is your mentoring startegy?",
						"answers": "I will provide my insights"
					}
				],
				"categoryId": "60b5b847-99a2-4e47-b35b-81b4284311dd"
			}

      await supertest(server).post('/api/mentors').send(mentorInfo).expect(401)
    })

    it('should return a 404 when the category id is not valid', async () => {
			const mentorInfo = {
				"application": [
					{
						"question": "What is your country?",
						"answers": "Singapore"
					},
					{
						"question": "What is your expertise?",
						"answers": "Software Engineering"
					},
					{
						"question": "What is your mentoring startegy?",
						"answers": "I will provide my insights"
					}
				],
				"categoryId": "60b5b847-99a2-4e47-b35b-81b4284311xx"
			}

      await supertest(server).post('/api/mentors').send(mentorInfo).expect(401)
    })

		it('should return a 401 when a valid access token is not provided', async () => {
      await supertest(server).post('/api/mentors').send({}).expect(401)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
  })
})

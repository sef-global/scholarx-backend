import server from '../app';
import supertest from 'supertest';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const response = await supertest(server)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('primary_email', 'test@example.com');
  });

  it('should not register with missing fields', async () => {
    const response = await supertest(server)
      .post('/api/auth/register')
      .send({
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required fields');
  });

  it('should not register with an existing email', async () => {
    const response = await supertest(server)
      .post('/api/auth/register')
      .send({
        email: 'existing@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Email already exists');
  });

  it('should login with correct credentials', async () => {
    const response = await supertest(server)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with incorrect credentials', async () => {
    const response = await supertest(server)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should not login with missing fields', async () => {
    const response = await supertest(server)
      .post('/api/auth/login')
      .send({
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required fields');
  });
});

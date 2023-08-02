import server from '../app';
import supertest from 'supertest';

describe('profile', () => {
  describe('Get profile route', () => {
    let accessToken: string;

    beforeAll(async () => {
      const testUser = {
        email: 'test@gmail.com',
        password: '123',
      };

      const response = await supertest(server)
        .post('/api/auth/login')
        .send(testUser)
        .expect(200);

      accessToken = response.body.token;
    });

    it('should return a 401 without a valid access token', async () => {
      await supertest(server).get('/api/me/profile').expect(401);
    });

    it('should return a 200 with a user profile object', async () => {
      const response = await supertest(server)
        .get('/api/me/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
      expect(response.body).toHaveProperty('primary_email');
      expect(response.body).toHaveProperty('contact_email');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('image_url');
      expect(response.body).toHaveProperty('linkedin_url');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('uuid');
    });
  });
});

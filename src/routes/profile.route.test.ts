import server from '../app';
import supertest from 'supertest';

describe('profile', () => {
  describe('Get profile route', () => {
    let accessToken: string; // Declare the access token as a variable accessible across tests

    beforeAll(async () => {
      // Create a test user (you can use a testing database or mock the user creation)
      const testUser = {
        email: 'test@gmail.com',
        password: '123',
      };

      // Log in the test user to get the access token
      const response = await supertest(server)
        .post('/api/auth/login')
        .send(testUser)
        .expect(200);

      // Extract the access token from the response body
      accessToken = response.body.token;
    });

    // Test if api returns 401 Unauthorised when no access token is passed
    it('should return a 401 without a valid access token', async () => {
      await supertest(server).get('/api/me/profile').expect(401);
    });

    it('should return a 200 with a user profile object', async () => {
      // Make the request with the valid access token (expect 200 OK)
      const response = await supertest(server)
        .get('/api/me/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify the response contains the expected keys
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

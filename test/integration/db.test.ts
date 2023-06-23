/*import request from 'supertest';
import app from '../../src/app';
import { testConnection } from '../../src/configs/dbConfig';
import server from '../../src/index';

// Mock the database connection
jest.mock('../../src/configs/dbConfig', () => ({
  testConnection: jest.fn()
}));

describe('Database Connection', () => {
    let expressServer: any;

  beforeAll(() => {
    expressServer = server;
  });

  afterAll((done) => {
    expressServer.close(done);
  });

  it('should test database connection', async () => {
    await request(expressServer).get('/');

    expect(testConnection).toHaveBeenCalled();
  });
});*/
import { testConnection } from '../../src/configs/dbConfig';

describe('Database Connection', () => {
  it('should test database connection', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });
});


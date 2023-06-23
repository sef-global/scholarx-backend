import { testConnection } from '../../src/configs/dbConfig';

describe('Database Connection', () => {
  it('should test database connection', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });
});


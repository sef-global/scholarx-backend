import { testConnection } from '../../src/configs/dbConfig';

describe('typeorm connection', () => {
  it('should test typeorm connection', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });
});

import { initConnection } from '../../src/configs/dbConfig';

describe('typeorm connection', () => {
  it('should test typeorm connection', async () => {
    await expect(initConnection()).resolves.not.toThrow();
  });
});

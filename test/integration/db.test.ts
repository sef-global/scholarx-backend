import { dataSource } from "../../src/configs/dbConfig"

export const initConnection = async (): Promise<void> => {
  await dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!')
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err)
      throw new Error('Data Source initialization failed')
    })
}

describe('typeorm connection', () => {
  it('should test typeorm connection', async () => {
    await expect(initConnection()).resolves.not.toThrow()
  })
})

import startServer from './app'
import { SERVER_PORT } from './configs/envConfig'

const port = SERVER_PORT as number

async function start(): Promise<void> {
  try {
    await startServer(port)
    console.log('Server started!')
  } catch (err) {
    console.error('Something went wrong!', err)
  }
}

start().catch((err) => {
  console.error(err)
})

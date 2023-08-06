import startServer from "./app";

async function start() : Promise<void>{
  try {
    await startServer();
    console.log("Server started!");
  } catch (err) {
    console.error("Something went wrong!", err);
  }
}

start().catch((err) => {console.error(err)});

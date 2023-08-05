import startServer from "./app";

startServer().then(()=> {console.log("Server started!")
}).catch((err) => { console.log("Something went wrong!", err) })

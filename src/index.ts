import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("ScholarX Backend");
});

app.listen(3000, () => {
  console.log("Server Started on PORT 3000");
});

export default app;

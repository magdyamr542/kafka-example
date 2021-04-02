import express from "express";
import cors from "cors";
require("dotenv").config();

const PORT = 1234;
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.listen(PORT, () => console.log("Server Started on port => " + PORT));
};

main();

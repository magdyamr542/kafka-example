import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/test", (_, res) => {
    res.send("Hello. this message is from the producer");
  });

  const port = getEnv().PRODUCER_PORT;
  app.listen(port, () => console.log("Server Started on port => " + port));
};

main();

import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { router } from "./routes/routes";

const env = getEnv();
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/", router);
  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    console.log("Producer Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );
};
main();

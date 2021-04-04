import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { logger } from "./utils/winston";
import { router } from "./routes/routes";

const env = getEnv();

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/topics", router);
  app.listen(env.CONSUMER_PORT_CONTAINER, () =>
    logger.info("Consumer Started on port => " + env.CONSUMER_PORT_CONTAINER)
  );
};

main();

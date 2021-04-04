import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { router } from "./routes/routes";
import { logger } from "./utils/winston";

const env = getEnv();
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/", router);
  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    logger.info("Producer Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );
};
main();

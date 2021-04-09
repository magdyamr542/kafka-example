import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { getEnv, getRequestIp } from "./utils/utils";
import { logger } from "./utils/winston";
import { router } from "./routes/routes";

const env = getEnv();

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // logging
  logger.info(`URL: ${req.originalUrl}`);
  logger.info(`IP: ${getRequestIp(req)}`);
  next();
};
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(loggingMiddleware);
  app.use(express.json());
  app.use("/topics", router);
  app.listen(env.CONSUMER_PORT_CONTAINER, () =>
    logger.info("Consumer Started on port => " + env.CONSUMER_PORT_CONTAINER)
  );
};

main();

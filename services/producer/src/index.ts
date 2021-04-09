import express, { request } from "express";
import cors from "cors";
import { getEnv, getRequestIp } from "./utils/utils";
import { router } from "./routes/routes";
import { logger } from "./utils/winston";
import { NextFunction, Request, Response } from "express";

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
const env = getEnv();
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(loggingMiddleware);
  app.use(express.json());
  app.use("/", router);
  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    logger.info("Producer Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );
};
main();

import express, { request } from "express";
import cors from "cors";
import { getEnv, getRequestIp } from "./utils/utils";
import { router } from "./routes/routes";
import { logger } from "./utils/winston";
import { NextFunction, Request, Response } from "express";

export const resLoggingMiddleware = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const originalFunc = res.json;
  res.json = function (this: typeof res.json, obj: any) {
    logger.info("Got Response is: ");
    logger.info(obj);
    originalFunc.call(this, obj);
  } as typeof originalFunc;
  next();
};

export const reqLoggingMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  // logging
  logger.info(`Got Request URL: ${req.originalUrl}`);
  logger.info(`Got Request IP: ${getRequestIp(req)}`);
  next();
};

const env = getEnv();
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(reqLoggingMiddleware);
  app.use(resLoggingMiddleware);
  app.use(express.json());
  app.use("/", router);
  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    logger.info("Producer Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );
};
main();

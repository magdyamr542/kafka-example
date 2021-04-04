import { Router } from "express";
import { router as messageRouter } from "./message.routes.";
import { router as topicRouter } from "./topics.routes";
const router = Router();
router.use("/topics", topicRouter);
router.use("/message", messageRouter);
export { router };

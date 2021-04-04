import { Router } from "express";
import { KafkaConsumer } from "../kafka/kafka-consumer";
import { kafkaInit } from "../kafka/kafka-init";
import { logger } from "../utils/winston";
const router = Router();
const { broker } = kafkaInit();
interface Message {
  key: string;
}
router.post("/subscribe", async (req, res) => {
  const topic = req.body.topic;
  logger.info(`Request to consume the topic ${topic}`);
  const consumer = new KafkaConsumer<Message>(
    broker.consumer({ groupId: "consumer-group-id" })
  );
  const subscribed = await consumer.consume(topic, (msg) => {
    logger.info(`Key: ${msg.key}`);
  });
  if (subscribed) {
    res.json({
      message: `Subscribe to topic ${topic} successfully`,
    });
  } else {
    res.json({
      message: `Could not subscribe to topic ${topic}. it does not exist`,
    });
  }
});
export { router };

import { Router } from "express";
import { RecordMetadata } from "kafkajs";
import { kafkaInit } from "../kafka/kafka-init";
import { generateKafkaMessage, sendMessage } from "../utils/utils";
import { logger } from "../utils/winston";
const router = Router();

/* Kafka Init */
const { kafkaProducer, kafkaTopicManager } = kafkaInit();

router.post("/sendMessage", async (req, res) => {
  const { message, topic } = req.body;
  logger.info(`Sending message ${JSON.stringify(message)} to topic ${topic}`);
  const doesTopicExist = await kafkaTopicManager.doesTopicExist(topic);
  if (!doesTopicExist) {
    logger.error(`Topic ${topic} does not exist. Ignoring sending the message`);
    res.json(
      sendMessage(`Topic ${topic} does not exist. Ignoring sending the message`)
    );
    return;
  }
  const kafkaMessage = generateKafkaMessage(message);
  const msgMetaData = await kafkaProducer.send(topic, [kafkaMessage]);
  res.json({
    data: msgMetaData,
    ...sendMessage("Sent message successfully "),
    sent: kafkaMessage,
  });
});

// Broadcasting a message to all topics
router.post("/broadcastMessage", async (req, res) => {
  const { message, topics } = req.body;
  // Process topics
  const availableTopics = await kafkaTopicManager.getTopics();
  const ignoredTopics = (topics as string[]).filter(
    (topic) => !availableTopics.includes(topic)
  );
  // Send messages and collect metadata
  const collectedMetaData: { [topic: string]: RecordMetadata[] } = {};
  const mappings = availableTopics.map(async (topic) => {
    if (ignoredTopics.includes(topic)) return false;
    collectedMetaData[topic] = await kafkaProducer.send(topic, [
      generateKafkaMessage(message),
    ]);
    return true;
  });
  await Promise.all(mappings);
  // Tell client about results
  res.json({
    data: collectedMetaData,
    ignoredTopics,
  });
});

export { router };

import { Router } from "express";
import { RecordMetadata } from "kafkajs";
import { kafkaInit } from "../api/kafka-init";
import { generateKafkaMessage } from "../utils/utils";
import { logger } from "../utils/winston";
const router = Router();

/* Kafka Init */
const { kafkaProducer, kafkaTopicManager } = kafkaInit();

const sendMessage = (message: string) => ({ message });

// Getting all the topics
router.get("/getTopics", async (_, res) => {
  logger.info("Got Request /getTopics");
  res.json({
    topics: await kafkaTopicManager.getTopics(),
  });
});

router.get("/doesTopicExist", async (req, res) => {
  const topic = req.body.topic;
  logger.info(`Got Request /doesTopicExists with topic ${topic}`);
  res.json({
    exists: await kafkaTopicManager.doesTopicExist(topic),
  });
});

// Creating a topic
router.post("/createTopic", async (req, res) => {
  const topic = req.body.topic;
  const wasTopicCreated = await kafkaTopicManager.createTopicByName(topic);
  if (wasTopicCreated) {
    res.json(sendMessage(`Topic ${topic} was created successfully.`));
  } else {
    logger.error(`Topic ${topic} could not be created. It already exists.`);
    res.json(
      sendMessage(`Topic ${topic} could not be created. It already exists.`)
    );
  }
});

// Deleting a topic
router.delete("/deleteTopic", async (req, res) => {
  const topic = req.body.topic;
  const doesTopicExist = await kafkaTopicManager.doesTopicExist(topic);
  if (!doesTopicExist) {
    res.json(
      sendMessage(
        `Could not delete the topic ${topic} because it does not exist.`
      )
    );
    return;
  }
  const deletedTopic = await kafkaTopicManager.deleteTopicByName(topic);
  if (deletedTopic) {
    res.json(sendMessage(`Delete topic ${topic} successfully.`));
  } else {
    logger.error(`Could not delete the topic ${topic}.`);
    res.json(sendMessage(`Could not delete the topic ${topic}.`));
  }
});

// Deleting more than one topic
router.delete("/deleteTopics", async (req, res) => {
  const topics = req.body.topics as string[];
  const availableTopics = await kafkaTopicManager.getTopics();
  const toDeleteTopics = topics.filter((topic) =>
    availableTopics.includes(topic)
  );
  const deletedAllSuccessfully = await kafkaTopicManager.deleteTopicsByName(
    toDeleteTopics
  );
  if (deletedAllSuccessfully) {
    res.json({
      ...sendMessage(`Deleted topics successfully.`),
      deletedTopics: toDeleteTopics,
    });
  } else {
    res.json(sendMessage("Could not delete all topics."));
  }
});
// Sending a message to a topic
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

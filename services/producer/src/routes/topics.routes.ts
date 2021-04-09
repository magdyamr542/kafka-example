import { Router } from "express";
import { kafkaInit } from "../kafka/kafka-init";
import { sendMessage } from "../utils/utils";
import { logger } from "../utils/winston";
const router = Router();

/* Kafka Init */
const { kafkaTopicManager } = kafkaInit();

// Getting all the topics
router.get("/getTopics", async (_, res) => {
  res.json({
    topics: await kafkaTopicManager.getTopics(),
  });
});

router.get("/doesTopicExist", async (req, res) => {
  const topic = req.body.topic;
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

// Getting topic metadata
router.get("/getTopicMetadata", async (req, res) => {
  const topic = req.body.topic;
  logger.info(`Got Request /getTopicMetadata with topic ${topic}`);
  const doesTopicExist = await kafkaTopicManager.doesTopicExist(topic);
  if (doesTopicExist) {
    res.json({
      metadata: await kafkaTopicManager.getTopicMetaData(topic),
    });
  } else {
    res.json({
      metadata: [],
      ...sendMessage(`Topic ${topic} does not exist.`),
    });
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

export { router };

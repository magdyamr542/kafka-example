import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { Kafka } from "kafkajs";

const env = getEnv();

const kafkaBroker = new Kafka({
  clientId: env.CONSUMER_CONTAINER_NAME,
  brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
});
const admin = kafkaBroker.admin();
const consumer = kafkaBroker.consumer({ groupId: "group-name" });

const connect = async () => {
  await admin.connect();
  await consumer.connect();
};

const consume = async () => {
  const topics = env.TOPICS?.split(",");
  topics?.forEach(async (topic) => {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
  });
};

const doConsume = async () => {
  await connect();
  consume().catch(console.error);
};

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/listTopics", async (_, res) => {
    res.send(await admin.listTopics());
  });

  app.post("/consume", async (_, res) => {
    await doConsume();
    res.send("Setup consuming...");
  });

  app.listen(env.CONSUMER_PORT_CONTAINER, () =>
    console.log("Consumer Started on port => " + env.CONSUMER_PORT_CONTAINER)
  );
};

main();

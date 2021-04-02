import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { Kafka } from "kafkajs";

const env = getEnv();

const kafkaBroker = new Kafka({
  clientId: env.PRODUCER_CONTAINER_NAME,
  brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
});
const producer = kafkaBroker.producer();
const admin = kafkaBroker.admin();

const produce = async () => {
  const topics = env.TOPICS?.split(",");
  topics?.forEach(async (topic) => {
    const randomNumber = Math.floor(Math.random() * 100000);
    await producer.send({
      topic,
      messages: [{ value: `Hello this is msg from kafka => ${randomNumber}` }],
    });
  });
};

const connect = async () => {
  await producer.connect();
};

const createTopics = async () => {
  await admin.connect();
  const topics = env.TOPICS?.split(",").map((topic) => {
    return { topic };
  });
  if (topics) {
    console.log("Creating topics..", topics);
    await admin.createTopics({
      waitForLeaders: true,
      topics,
    });
  }
};
const doProduce = async () => {
  await connect();
  produce().catch(console.error);
};

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post("/produce", async (_, res) => {
    await doProduce();
    res.send("Done producing...");
  });

  app.post("/createTopics", async (_, res) => {
    await createTopics();
    res.send("Done creating topics...");
  });

  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    console.log("Producer Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );
};

main();

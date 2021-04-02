import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { Kafka } from "kafkajs";

const env = getEnv();

const kafkaBroker = new Kafka({
  clientId: env.PRODUCER_CONTAINER_NAME,
  brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
});
const consumer = kafkaBroker.consumer();
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "some-random-topic", fromBeginning: true });
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
};

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/test", (_, res) => {
    res.send("Hello. this message is from the producer");
  });

  app.listen(env.PRODUCER_PORT_CONTAINER, () =>
    console.log("Server Started on port => " + env.PRODUCER_PORT_CONTAINER)
  );

  run().catch(console.error);
};

main();

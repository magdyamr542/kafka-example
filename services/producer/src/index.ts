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
const run = async () => {
  await producer.connect();
  await producer.send({
    topic: "some-random-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
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

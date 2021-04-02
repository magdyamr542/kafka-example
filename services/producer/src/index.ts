import express from "express";
import cors from "cors";
import { getEnv } from "./utils/utils";
import { Kafka } from "kafkajs";

const env = getEnv();

const kafkaBroker = new Kafka({
  clientId: getEnv().PRODUCER_CONTAINER_NAME,
  brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
});
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
};

main();

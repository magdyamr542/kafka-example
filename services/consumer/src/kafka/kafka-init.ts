import { Kafka } from "kafkajs";
import { getEnv } from "../utils/utils";
import { KafkaConsumer } from "./kafka-consumer";

export const kafkaInit = () => {
  const env = getEnv();
  const kafkaBroker = new Kafka({
    clientId: env.CONSUMER_CONTAINER_NAME,
    brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
  });

  return {
    broker: kafkaBroker,
  };
};

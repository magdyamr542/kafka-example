import { Kafka } from "kafkajs";
import { getEnv } from "../utils/utils";
import { KafkaProducer } from "./kafka-producer";
import { KafkaTopicManager } from "./kafka-topic-manager";

export const kafkaInit = () => {
  const env = getEnv();
  const kafkaBroker = new Kafka({
    clientId: env.PRODUCER_CONTAINER_NAME,
    brokers: [`${env.KAFKA_CONTAINER_NAME}:${env.KAFKA_PORT_CONTAINER}`],
  });
  const producer = kafkaBroker.producer();
  const admin = kafkaBroker.admin();
  const kafkaTopicManager = new KafkaTopicManager(admin);
  const kafkaProducer = new KafkaProducer(producer);
  return {
    broker: kafkaBroker,
    producer,
    admin,
    kafkaTopicManager,
    kafkaProducer,
  };
};

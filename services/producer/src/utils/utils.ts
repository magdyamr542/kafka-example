import { Message } from "kafkajs";

require("dotenv").config();
export const getEnv = (): NodeJS.ProcessEnv => {
  return {
    PRODUCER_PORT_CONTAINER: process.env.PRODUCER_PORT_CONTAINER,
    CONSUMER_PORT_CONTAINER: process.env.CONSUMER_PORT_CONTAINER,
    KAFKA_PORT_CONTAINER: process.env.KAFKA_PORT_CONTAINER,
    PRODUCER_CONTAINER_NAME: process.env.PRODUCER_CONTAINER_NAME,
    CONSUMER_CONTAINER_NAME: process.env.CONSUMER_CONTAINER_NAME,
    KAFKA_CONTAINER_NAME: process.env.KAFKA_CONTAINER_NAME,
  };
};

export const getHash = () => {
  return Math.floor(Math.random() * 1000 * 1000).toString();
};

export const generateKafkaMessage = (msg: string | object): Message => {
  if (msg instanceof Object) {
    msg = JSON.stringify(msg);
  }
  return {
    key: getHash(),
    value: msg,
    timestamp: Date.now().toString(),
  };
};

export const sendMessage = (message: string) => ({ message });

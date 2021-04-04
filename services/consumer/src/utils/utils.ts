require("dotenv").config();
export const getEnv = (): NodeJS.ProcessEnv => {
  return {
    PRODUCER_PORT_CONTAINER: process.env.PRODUCER_PORT_CONTAINER,
    PRODUCER_CONTAINER_NAME: process.env.PRODUCER_CONTAINER_NAME,
    CONSUMER_CONTAINER_NAME: process.env.CONSUMER_CONTAINER_NAME,
    KAFKA_CONTAINER_NAME: process.env.KAFKA_CONTAINER_NAME,
    KAFKA_PORT_CONTAINER: process.env.KAFKA_PORT_CONTAINER,
    CONSUMER_PORT_CONTAINER: process.env.CONSUMER_PORT_CONTAINER,
  };
};
export const bufferToJson = (val?: Buffer | null) => {
  if (!val) return {};
  return JSON.parse(val.toString("utf-8"));
};

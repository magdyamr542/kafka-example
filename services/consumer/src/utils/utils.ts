require("dotenv").config();
export const getEnv = (): NodeJS.ProcessEnv => {
  return {
    PRODUCER_PORT_CONTAINER: process.env.PRODUCER_PORT_CONTAINER,
    PRODUCER_CONTAINER_NAME: process.env.PRODUCER_CONTAINER_NAME,
    CONSUMER_CONTAINER_NAME: process.env.CONSUMER_CONTAINER_NAME,
    KAFKA_CONTAINER_NAME: process.env.KAFKA_CONTAINER_NAME,
    KAFKA_PORT_CONTAINER: process.env.KAFKA_PORT_CONTAINER,
  };
};

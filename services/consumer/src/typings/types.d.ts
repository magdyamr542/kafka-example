export {};
// for env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRODUCER_PORT_CONTAINER?: string;
      PRODUCER_PORT_HOST?: string;
      CONSUMER_PORT_CONTAINER?: string;
      CONSUMER_PORT_HOST?: string;
      KAFKA_PORT_CONTAINER?: string;
      KAFKA_PORT_HOST?: string;
      PRODUCER_CONTAINER_NAME?: string;
      CONSUMER_CONTAINER_NAME?: string;
      KAFKA_CONTAINER_NAME?: string;
      TOPICS?: string;
    }
  }
}

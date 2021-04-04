export {};
// for env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRODUCER_PORT_CONTAINER?: string;
      PRODUCER_CONTAINER_NAME?: string;
      CONSUMER_CONTAINER_NAME?: string;
      CONSUMER_PORT_CONTAINER?: string;
      KAFKA_PORT_CONTAINER?: string;
      KAFKA_CONTAINER_NAME?: string;
    }
  }
}

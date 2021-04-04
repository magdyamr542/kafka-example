export {};
// for env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRODUCER_PORT_CONTAINER?: string;
      PRODUCER_PORT_HOST?: string;
      KAFKA_PORT_CONTAINER?: string;
      PRODUCER_CONTAINER_NAME?: string;
      KAFKA_CONTAINER_NAME?: string;
    }
  }
}

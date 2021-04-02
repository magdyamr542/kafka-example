export {};
// for env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRODUCER_PORT?: string;
    }
  }
}

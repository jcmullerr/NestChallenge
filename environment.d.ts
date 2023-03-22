declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_DB_CONNECTION_STRING: string;
        RABBITMQ_DEFAULT_USER: string;
        RABBITMQ_DEFAULT_PASS: string;
        RABBITMQ_USER: string;
        RABBITMQ_PASS: string;
        RABBITMQ_HOST: string;
        RABBITMQ_EVENT_QUEUE: string;
      }
    }
  }
  export {};
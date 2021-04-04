import axios from "axios";
import { Consumer } from "kafkajs";
import { bufferToJson, getEnv } from "../utils/utils";
import { logger } from "../utils/winston";

const env = getEnv();
type MessageHandler<T> = (message: T) => void;

export interface IKafkaConsumer<T> {
  consume: (
    topic: string,
    onMessage: MessageHandler<T>,
    fromBeginning?: boolean
  ) => Promise<boolean>;
}
export class KafkaConsumer<T> implements IKafkaConsumer<T> {
  constructor(private readonly consumer: Consumer) {}
  public async consume(
    topic: string,
    onMessage: MessageHandler<T>,
    fromBeginning = true
  ) {
    if (!(await this.doesTopicExist(topic))) {
      logger.error(`Cannot consume topic ${topic} as it does not exist.`);
      return false;
    }
    try {
      await this.consumer.subscribe({ topic, fromBeginning });
      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          logger.info(
            `Got new message from topic ${topic}. %j`,
            bufferToJson(message.value)
          );
          onMessage(bufferToJson(message.value) as T);
        },
      });
      return true;
    } catch {
      logger.error(`Error happened while consuming the topic ${topic}`);
      return false;
    }
  }

  private async doesTopicExist(topic: string) {
    try {
      logger.info(`Checking if topic ${topic} exists.`);
      const res = await axios.get<{ exists: boolean }>(
        `http://${env.PRODUCER_CONTAINER_NAME}:${env.PRODUCER_PORT_CONTAINER}/topics/doesTopicExist`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            topic,
          },
        }
      );
      logger.info(`Does ${topic} exists ? ${res.data.exists}`);
      return res.data.exists;
    } catch (err: unknown) {
      logger.error("Got error while checking if topic exists %j", err);
      return false;
    }
  }
}

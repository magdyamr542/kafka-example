import axios from "axios";
import { Consumer } from "kafkajs";
import { getEnv } from "../utils/utils";
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
    logger.info(`Request to consume the topic ${topic}`);
    if (!(await this.doesTopicExist(topic))) {
      logger.error(`Cannot consume topic ${topic} as it does not exist.`);
      return false;
    }
    try {
      await this.consumer.subscribe({ topic, fromBeginning });
      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          logger.info(`Got new message from topic ${topic}. %j`, message.value);
          onMessage((message.value as unknown) as T);
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
      const res = await axios.delete<{ exists: boolean }>(
        `http://${env.PRODUCER_CONTAINER_NAME}:${env.PRODUCER_PORT_CONTAINER}/topics/doesTopicExist`,
        {
          headers: {
            "content-type": "application/json",
          },
          data: {
            topic,
          },
        }
      );
      logger.info(`Topic ${topic}exists: ${res.data.exists}`);
      return res.data.exists;
    } catch (err: unknown) {
      logger.error("Got error while checking if topic exists %j", err);
      return false;
    }
  }
}

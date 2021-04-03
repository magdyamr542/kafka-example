import { Admin, ITopicConfig, ITopicMetadata } from "kafkajs";

export interface IKafkaTopicManager {
  createTopicByName: (topicName: string) => Promise<boolean>;
  createTopicByConfig: (topic: ITopicConfig) => Promise<boolean>;
  deleteTopicByName: (topicName: string) => Promise<boolean>;
  getTopicMetaData: (topicName: string) => Promise<ITopicMetadata[]>;
  getTopics: () => Promise<string[]>;
}
export class KafkaTopicManager implements IKafkaTopicManager {
  constructor(private readonly admin: Admin) {
    this.connect();
  }
  private async connect() {
    await this.admin.connect();
  }

  public async createTopicByName(topicName: string) {
    return this.admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: topicName,
        },
      ],
    });
  }
  public createTopicByConfig(topic: ITopicConfig) {
    return this.admin.createTopics({
      waitForLeaders: true,
      topics: [topic],
    });
  }

  getTopics() {
    return this.admin.listTopics();
  }
  public async deleteTopicByName(topicName: string) {
    try {
      await this.admin.deleteTopics({
        topics: [topicName],
      });
      return true;
    } catch (error: unknown) {
      console.log(
        `Could not delete topic with name ${topicName} because => ${error}`
      );
      return false;
    }
  }

  public async getTopicMetaData(topicName: string) {
    return await (await this.admin.fetchTopicMetadata({ topics: [topicName] }))
      .topics;
  }
}

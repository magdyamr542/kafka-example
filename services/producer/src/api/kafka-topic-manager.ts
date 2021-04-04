import { Admin, ITopicConfig, ITopicMetadata } from "kafkajs";

export interface IKafkaTopicManager {
  createTopicByName: (topicName: string) => Promise<boolean>;
  createTopicByConfig: (topic: ITopicConfig) => Promise<boolean>;
  deleteTopicByName: (topicName: string) => Promise<boolean>;
  deleteTopicsByName: (topics: string[]) => Promise<boolean>;
  getTopicMetaData: (topicName: string) => Promise<ITopicMetadata[]>;
  getTopics: () => Promise<string[]>;
  doesTopicExist: (topicName: string) => Promise<boolean>;
}
export class KafkaTopicManager implements IKafkaTopicManager {
  constructor(private readonly admin: Admin) {
    this.connect();
  }
  private async connect() {
    await this.admin.connect();
  }

  public async createTopicByName(topicName: string) {
    try {
      return await this.admin.createTopics({
        waitForLeaders: true,
        topics: [
          {
            topic: topicName,
          },
        ],
      });
    } catch {
      return false;
    }
  }
  public async createTopicByConfig(topic: ITopicConfig) {
    try {
      return this.admin.createTopics({
        waitForLeaders: true,
        topics: [topic],
      });
    } catch {
      return false;
    }
  }

  getTopics() {
    return this.admin.listTopics();
  }

  public async deleteTopicsByName(topics: string[]) {
    const booleans = topics.map((topic) => this.deleteTopicByName(topic));
    return (
      (await Promise.all(booleans)).filter((bool) => bool === false).length ===
      0
    );
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

  public async doesTopicExist(topicName: string) {
    return await (await this.getTopics()).includes(topicName);
  }
}

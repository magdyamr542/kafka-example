import { Message, Producer, RecordMetadata } from "kafkajs";

export interface IKafkaProducer {
  send: (topic: string, messages: Message[]) => Promise<RecordMetadata[]>;
  broadcast: (
    topics: string[],
    messages: Message[]
  ) => Promise<{ [topicName: string]: RecordMetadata[] }>;
}

export class KafkaProducer implements IKafkaProducer {
  constructor(private readonly producer: Producer) {
    this.producer.connect();
  }
  public send(topic: string, messages: Message[]) {
    return this.producer.send({
      topic,
      messages,
    });
  }
  public async broadcast(topics: string[], messages: Message[]) {
    const metaDataHashmap: { [topicName: string]: RecordMetadata[] } = {};
    topics.forEach(async (topic) => {
      metaDataHashmap[topic] = await this.send(topic, messages);
    });
    return metaDataHashmap;
  }
}

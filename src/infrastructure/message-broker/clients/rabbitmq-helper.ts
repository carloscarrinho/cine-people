import { Connection, connect, Channel  } from 'amqplib';

export const RabbitMQHelper = {
  connection: null as Connection,
  channel: null as Channel,

  async connect(uri: string): Promise<void> {
    this.connection = await connect(uri);
    this.channel = await this.connection.createChannel();
  },

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
      this.connection = null;
      this.channel = null;
    }
  },

  async createChannel(): Promise<Channel> {
    return this.channel;
  }
};

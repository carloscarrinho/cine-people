import { Notifier } from "../../../application/contracts/notifier";
import { RabbitMQHelper } from "../../message-broker/clients/rabbitmq-helper";

export class RabbitMQAdapter implements Notifier {
  async publish(queue: string, message: string): Promise<boolean> {
    const channel = await RabbitMQHelper.createChannel();
    return channel.sendToQueue(queue, Buffer.from(message));
  }
}
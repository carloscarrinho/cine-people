import { Notifier } from '../../../../../src/application/contracts/notifier'
import { RabbitMQHelper } from '../../../../../src/infrastructure/message-broker/clients/rabbitmq-helper';
import { RabbitMQAdapter } from '../../../../../src/infrastructure/services/notification-service/rabbitmq-adapter'
import env from '../../../../../src/main/config/env';

const makeSut = (): Notifier => {
  return new RabbitMQAdapter();
}

describe('Unit', () => {
  describe('Infrastructure: Services', () => {
    describe('RabbitMQAdapter', () => {      
      beforeAll(async () => {
        await RabbitMQHelper.connect(env.rabbitMQ);
      });

      afterAll(async () => {
        await RabbitMQHelper.disconnect();
      });

      it('Should return true if publish message on queue with success', async () => {
        // Given
        const queue = 'any_queue';
        const message = 'any_message';
        const rabbitMQAdapter = makeSut();

        // When
        const result = await rabbitMQAdapter.publish(queue, message);
      
        // Then
        expect(result).toBeTruthy();
      });
    });
  });
});
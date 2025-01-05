import { startEmailReceiver } from '../src/rabbitmq/emailReveiver';
import { getRabbitMQConnection } from '../src/rabbitmq/connection';
import { sendPasswordResetEmail } from '../src/email/resetPassword';

jest.mock('../src/rabbitmq/connection');
jest.mock('../src/email/resetPassword');

describe('Email Receiver', () => {
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(null),
      consume: jest.fn((queueName: string, callback: any) => {
        const fakeMsg = {
          content: Buffer.from(JSON.stringify({ email: 'test@example.com', resetToken: 'abc123' })),
        };
        callback(fakeMsg);
      }),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    (getRabbitMQConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should consume messages and call sendPasswordResetEmail', async () => {
    await startEmailReceiver();

    expect(getRabbitMQConnection).toHaveBeenCalled();

    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('Reset_Password', { durable: true });

    expect(mockChannel.consume).toHaveBeenCalledWith('Reset_Password', expect.any(Function));

    expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', 'abc123');

    expect(mockChannel.ack).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockConnection.createChannel.mockRejectedValue(new Error('Channel creation failed'));

    await expect(startEmailReceiver()).resolves.toBeUndefined();

  });
});

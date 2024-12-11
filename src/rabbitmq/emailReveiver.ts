import { getRabbitMQConnection } from './connection';
import { sendPasswordResetEmail } from '../email/resetPassword';

const QUEUE_NAME = 'Reset_Password';

export const startEmailReceiver = async () => {
  try {
    const connection = await getRabbitMQConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Waiting for messages in ${QUEUE_NAME} queue...`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const { email, resetToken } = JSON.parse(msg.content.toString());
        console.log(`Received message for ${email}`);

        await sendPasswordResetEmail(email, resetToken);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error in email receiver:", error);
  }
};

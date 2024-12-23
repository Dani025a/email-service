import amqp from 'amqplib';

let connection: amqp.Connection | null = null;

export const getRabbitMQConnection = async (): Promise<amqp.Connection> => {
  try {
    if (!connection) {
      connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
    }
    return connection;
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
};

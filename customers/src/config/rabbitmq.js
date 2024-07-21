const amqp = require('amqplib');

const connectRabbitMQ = async () => {
  let retries = 5;
  while (retries) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();
      await channel.assertQueue('customerQueue', { durable: true });
      console.log('Connected to RabbitMQ');
      return channel;
    } catch (error) {
      console.error('Error connecting to RabbitMQ, retrying...', error);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000)); // Attendre 5 secondes avant de réessayer
    }
  }
  throw new Error('Unable to connect to RabbitMQ after multiple attempts');
};

module.exports = connectRabbitMQ;
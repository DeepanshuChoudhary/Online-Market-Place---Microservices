const amqplib = require('amqplib');

let channel, connection;

const connect = async() => {

    if(connection) return connection;

    try {
        connection = await amqplib.connect(process.env.RABBIT_URL);
        console.log('Connected to RabbitMQ')
        channel = await connection.createChannel();
    }
    catch (error) {
        console.error('Error connecting to RabbitMQ:', error)
    }

}

const publishToQueue = async (queueName, data = {}) => {
    
    if(!channel || !connection) await connect();
    
    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log('Message send to queue:', queueName, data);
    
}

const subscribeToQueue = async (queueName, callback) => {

    if(!channel || !connection) await connect();

    await channel.assertQueue(queueName, { durable: true })

    channel.consumer(queueName, async (msg) => {
        if(msg !== null) {
            const data = JSON.parser(msg.content.toString());
            await callback(data);
            channel.ack(msg);
        }
    })
    
}

module.exports = {
    connect,
    channel,
    connection,
    publishToQueue,
    subscribeToQueue
}
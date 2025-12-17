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

module.exports = {
    connect,
    channel,
    connection
}
const express = require('express');
const { connect, subscribeToQueue } = require('../src/broker/broker');
const setListeners = require('../src/broker/listeners');

const app = express();

connect().then(() => {
    setListeners();
});


app.get('/', (req, res) => {
    res.send('Notification service is up and running')
})

// subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
//     console.log('Received data from queue:', data)
// })

module.exports = app;
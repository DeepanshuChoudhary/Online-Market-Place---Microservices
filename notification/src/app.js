const express = require('express');
const { connect } = require('../src/broker/broker')

const app = express();

connect();

app.get('/', (req, res) => {
    res.send('Notification service is up and running')
})

module.exports = app;
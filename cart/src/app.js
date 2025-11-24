const express = require('express');
const cartRouter = require('./routes/cart.routes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express());
app.use(cookieParser)

app.use('/api/cart', cartRouter);


module.exports = app;
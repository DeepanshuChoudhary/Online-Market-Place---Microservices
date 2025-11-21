require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(3001, () => {
    console.log("Product service are started at 3001");
})
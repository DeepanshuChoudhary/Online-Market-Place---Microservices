require('dotenv').config()
const app = require('./src/app');

app.listen(3006, () => {
    console.log("Notification service are running on port 3006")
})
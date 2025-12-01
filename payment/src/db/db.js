const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB are connected")
    }
    catch (err) {
        console.log("Error in MongoDB Connection: ", err)
    }
}

module.exports = connectDB;
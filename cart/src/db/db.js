const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB are connected")
    }
    catch(err) {
        console.error("Unable to connect with Mongodb: ", err);
    }
}

module.exports = connectDB;
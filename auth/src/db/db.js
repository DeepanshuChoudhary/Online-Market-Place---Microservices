const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Server is connected successfully");
    }
    catch (err) {
        console.log("Unable to connect with MongoDB: ", err)
    }
}

module.exports = connectDB;
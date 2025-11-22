const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB are connected")
    }
    catch(err) {
        console.log("Unable to connect with MongoDB", err)
    }
}

module.exports = connectDB;
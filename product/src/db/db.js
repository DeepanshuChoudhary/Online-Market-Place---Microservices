const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected Product')
    }
    catch (err) {
        console.log("There are some issue in the Product: ", err)
    }
}

module.exports = connectDB;
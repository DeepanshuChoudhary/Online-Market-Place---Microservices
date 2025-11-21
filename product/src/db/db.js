const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected with MongoDB")
    }
    catch(err) {
        console.log('Error in connection: ', err)
    }
}

module.exports = connectDB;
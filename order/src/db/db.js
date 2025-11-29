const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongodb server are connected on Order server')
    }
    catch(err) {
        console.log("Error: ", err);
    }
}

module.exports = connectDB;
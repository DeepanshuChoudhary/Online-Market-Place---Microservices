const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB are connected");
    }
    catch(error) {
        console.log("MongoDB server not connected!!!", error)
        process.exit(1);
    }
}

module.exports = connectDB;
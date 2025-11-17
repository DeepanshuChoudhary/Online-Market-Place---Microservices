const mongoose = require('mongoose');

const connectDB = async () => {
    try {  
        const mongoUri = uri || process.env.MONGO_URI;
        if(!mongoUri) throw new Error("MONGO_URI not provided // db.js"); 
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully");
    }
    catch (err) {
        console.log("Server connection failed: ", err)
    }
}

module.exports = connectDB;
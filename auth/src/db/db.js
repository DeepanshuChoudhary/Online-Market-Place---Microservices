const mongoose = require('mongoose');

async function connectDB(uri) {
    try {
        const mongoUri = uri || process.env.MONGO_URI;
        if (!mongoUri) throw new Error('MONGO_URI not provided');

        await mongoose.connect(mongoUri);
        console.log('Database connected successfully');
    } catch (err) {
        console.log('Server connection failed: ', err);
        throw err;
    }
}

module.exports = connectDB;
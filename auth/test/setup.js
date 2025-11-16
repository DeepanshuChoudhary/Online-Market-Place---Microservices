const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-momory-server');

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    process.env.MONGO_URI = uri;

    await mongoose.connect(uri);
});

// clean the database
afterEach(async () => {
    const collections = await mongoose.connection.db.collection();
    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

// stop the database
afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) mongo.stop();
});
const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        console.log('Connected to MongoDB ✅');
    } catch (err) {
        console.log('MongoDB connection error! ❌');

        process.exit(1);
    }
};

connectToMongoDB();
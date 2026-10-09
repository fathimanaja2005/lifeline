const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloodbank';
  
  try {
    // Attempt standard connection with 3-second timeout
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Successfully connected to MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local/Configured MongoDB connection failed (${error.message}).`);
    console.log('[Database] Starting embedded in-memory MongoDB server as fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB instance at: ${memUri}`);
    } catch (memError) {
      console.error('[Database] Critical Error: Failed to start embedded in-memory MongoDB:', memError.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };

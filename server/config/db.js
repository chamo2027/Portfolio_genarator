const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_generator';

  try {
    console.log(`[Database] Attempting connection to MongoDB at ${mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Database] MongoDB not reachable at ${mongoUri}.`);
    console.log('[Database] Activating fast zero-config JSON-persisted store (zero setup needed)...');
    isConnected = true;
    useMemoryStore = true;
  }
};

const getStoreMode = () => useMemoryStore;

module.exports = { connectDB, getStoreMode };

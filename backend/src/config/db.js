const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI missing from environment');
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB || 'sports_pwa',
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


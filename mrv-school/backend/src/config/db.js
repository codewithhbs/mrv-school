const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });
  console.log(`[db] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
}

module.exports = connectDB;

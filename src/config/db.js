const mongoose = require('mongoose');
require('dotenv').config();

// Debug: Verify environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing!');

const connectDB = async () => {
  try {
    // Simple connection without deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Verify connection
    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open');
    });
    
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
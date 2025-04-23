// Add this at the VERY TOP of server.js
console.log("✅ Server starting..."); // Verify execution reaches here
require('dotenv').config();
console.log("✅ Environment loaded:", {
  JWT_SECRET: process.env.JWT_SECRET ? "loaded" : "MISSING",
  MONGODB_URI: process.env.MONGODB_URI ? "loaded" : "MISSING"
});
const app = require('./src/app'); // Path is case-sensitive!
const connectDB = require('./src/config/db');
require('dotenv').config();

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
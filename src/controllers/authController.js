
// At the VERY TOP of the file
require('dotenv').config();
console.log('Controller JWT_SECRET:', process.env.JWT_SECRET || 'UNDEFINED!');

// In your register/login functions:
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined!');
}
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Enhanced error messages and validation
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' }); // 409 Conflict
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      token,
      user: { id: user._id, email: user.email } // Return minimal user data
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: err.message || 'Registration failed' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: err.message || 'Login failed' 
    });
  }
};
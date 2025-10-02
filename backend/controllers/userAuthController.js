const bcrypt = require('bcrypt');
const UserAccounts = require('../models/UserAccounts');
const jwt = require('jsonwebtoken');

// Login Controller for UserAccounts
// controllers/userController.js
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const user = await UserAccounts.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      role: user.role,
      beamsId: user.beamsId,   // ✅ beamsId
      user: {
        _id: user._id,         // ✅ Mongo ObjectId for Employee reference
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};

module.exports = { login };
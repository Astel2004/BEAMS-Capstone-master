const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserAccounts = require('../models/UserAccounts');
const jwt = require('jsonwebtoken');

// This login route works for BOTH HR and Employee roles
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Find user by email (case-sensitive)
    const user = await UserAccounts.findOne({ email: email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: 'User not found.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // At this point, user can be HR or Employee
    // You can add more roles if needed

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Respond with role so frontend can redirect accordingly
    res.status(200).json({ message: 'Login successful!', token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Add User route (for user management)
router.post('/add-user', async (req, res) => {
  const { employeeId, name, email, password, role } = req.body;
  try {
    if (!employeeId || !name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // Check if user already exists for this employee or email
    const existingUser = await UserAccounts.findOne({ $or: [ { email }, { employeeId } ] });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists for this employee or email.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new UserAccounts({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Get all users (for user management)
router.get('/list', async (req, res) => {
  try {
    const users = await UserAccounts.find({});
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserAccounts = require('../models/UserAccounts');
const Employees = require('../models/Employees'); // <-- ADD THIS LINE
const jwt = require('jsonwebtoken');

// ===================== LOGIN =====================
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

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // ✅ Updated response to include beamsId and user details
    res.status(200).json({
      message: 'Login successful!',
      token,
      role: user.role,
      beamsId: user.beamsId, // ✅ send beamsId directly
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        beamsId: user.beamsId // ✅ duplicate for convenience
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// ===================== BEAMS ID HELPERS =====================
function generateBeamsId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function getUniqueBeamsId() {
  let beamsId;
  let exists = true;
  while (exists) {
    beamsId = generateBeamsId();
    exists = await UserAccounts.findOne({ beamsId });
  }
  return beamsId;
}

// ===================== ADD USER =====================
router.post('/add-user', async (req, res) => {
  const { firstName, lastName, middleName, email, password, role } = req.body;

  const allowedRoles = ["Employee", "HR Staff", "Department Head"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role selected.' });
  }

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const name = `${firstName} ${middleName || ""} ${lastName}`.trim();

    const existingUser = await UserAccounts.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique BEAMS ID
    const beamsId = await getUniqueBeamsId();

    const newUser = new UserAccounts({
      name,
      email,
      password: hashedPassword,
      role,
      beamsId
    });

    await newUser.save();

    // --- CREATE CORRESPONDING EMPLOYEE RECORD ---
    const newEmployee = new Employees({
      surname: lastName,
      firstname: firstName,
      middlename: middleName,
      email: email,
      position: role, // or set to "" if you want to leave blank
      // Add other fields as needed
    });
    await newEmployee.save();
    // --------------------------------------------

    res.status(201).json({ message: 'User added successfully!', beamsId });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// ===================== GET ALL USERS =====================
router.get('/list', async (req, res) => {
  try {
    const users = await UserAccounts.find({});
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// ===================== DELETE USER =====================
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await UserAccounts.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// ===================== GET EMPLOYEES =====================
router.get('/employees', async (req, res) => {
  try {
    const employees = await UserAccounts.find({ role: "Employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
});

module.exports = router;

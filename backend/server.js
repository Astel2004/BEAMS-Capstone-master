require('dotenv').config({ path: './backend/.env' }); // Load environment variables
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes'); // Import user routes
const employeeRoutes = require('./routes/employeeRoutes'); // Import employee routes

const app = express();

// Enable CORS
app.use(cors()); // Allow all origins by default

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Use Routes
app.use('/api/user', userRoutes); // All user-related routes will be prefixed with /api/user
app.use('/api/employees', employeeRoutes); // All employee-related routes will be prefixed with /api

// Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
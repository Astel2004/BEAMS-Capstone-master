require('dotenv').config({ path: './backend/.env' }); // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const pdsRoutes = require('./routes/pdsRoutes');   // ✅ Import PDS routes
const salnRoutes = require('./routes/salnRoutes'); // ✅ Import SALN routes
const documentsRoutes = require('./routes/documentsRoutes'); // Import Documents routes

const app = express();

app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

app.use('/api/user', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/pds', pdsRoutes);   // ✅ Use PDS routes
app.use('/api/saln', salnRoutes); // ✅ Use SALN routes
app.use('/api/documents', documentsRoutes); // Use Documents routes

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
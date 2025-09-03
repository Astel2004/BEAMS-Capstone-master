const EmployeeRecords = require('../models/EmployeeRecords');

exports.createEmployeeRecords = async (req, res) => {
  try {
    const employeeRecords = new EmployeeRecords(req.body);
    await employeeRecords.save();
    res.status(201).json(employeeRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload EmployeeRecords document.' });
  }
};

exports.getAllEmployeeRecords = async (req, res) => {
  try {
    const docs = await EmployeeRecords.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch EmployeeRecords documents.' });
  }
};

// Add more functions for update, delete, etc.
const EmployeeRecords = require('../models/EmployeeRecords');

exports.createEmployeeRecords = async (req, res) => {
  try {
    // req.file contains file info, req.body contains other metadata
    const employeeRecords = new EmployeeRecords({
      employeeId: req.body.employeeId,
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Save file path
      dateUploaded: new Date(),
      status: req.body.status || 'Pending'
    });
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
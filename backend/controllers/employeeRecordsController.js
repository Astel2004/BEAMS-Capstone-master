const EmployeeRecords = require('../models/EmployeeRecords');

exports.createEmployeeRecords = async (req, res) => {
  try {
    const employeeRecords = new EmployeeRecords({
      employeeId: req.body.employeeId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      dateUploaded: new Date(),
      status: req.body.status || 'Pending',
      formData: req.body.formData ? JSON.parse(req.body.formData) : undefined // Add this line if sending formData as JSON string
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

exports.approveEmployeeRecord = async (req, res) => {
  try {
    const record = await EmployeeRecords.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.status = "Approved";
    await record.save();

    // Optionally: update Employee model with extracted data here

    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve EmployeeRecords document.' });
  }
};

exports.rejectEmployeeRecord = async (req, res) => {
  try {
    const record = await EmployeeRecords.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.status = "Rejected";
    await record.save();

    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject EmployeeRecords document.' });
  }
};

// Add more functions for update, delete, etc.
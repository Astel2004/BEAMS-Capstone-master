const Documents = require('../models/Documents');

exports.createDocuments = async (req, res) => {
  try {
    // req.file contains file info, req.body contains other metadata
    const documents = new Documents({
      employeeId: req.body.employeeId,
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Save file path
      dateUploaded: new Date(),
      status: req.body.status || 'Pending'
    });
    await documents.save();
    res.status(201).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload Documents document.' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Documents.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Documents documents.' });
  }
};

// Add more functions for update, delete, etc.
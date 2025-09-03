const Documents = require('../models/Documents');

exports.createDocuments = async (req, res) => {
  try {
    const documents = new Documents(req.body);
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
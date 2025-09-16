const Documents = require('../models/Documents');

exports.createDocuments = async (req, res) => {
  try {
    const documents = new Documents({
      employeeId: req.body.employeeId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      type: req.body.type, // <-- Save type
      dateUploaded: new Date(),
      status: req.body.status || 'Pending'
    });
    await documents.save();
    res.status(201).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document.' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const docs = await Documents.find(filter);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};

// Add more functions for update, delete, etc.
const Documents = require('../models/Documents');

exports.createDocuments = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const documents = new Documents({
      employeeId: req.body.employeeId,
      fileName: req.file ? req.file.originalname : undefined,
      fileUrl: req.file ? req.file.path : undefined,
      type: req.body.type,
      dateUploaded: new Date(),
      status: req.body.status || 'Pending'
    });
    await documents.save();
    res.status(201).json(documents);
  } catch (error) {
    console.error("CREATE DOCUMENTS ERROR:", error);
    res.status(500).json({ error: 'Failed to upload document.' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const docs = await Documents.find(filter).populate('employeeId');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Add more functions for update, delete, etc.
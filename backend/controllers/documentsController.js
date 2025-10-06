const Documents = require('../models/Documents');
const Employees = require('../models/Employees'); // Add this line if you want to update employee data

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
    res.status(500).json({ error: error.message || 'Failed to upload document.' });
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

// Approve Document Controller
exports.approveDocument = async (req, res) => {
  try {
    const doc = await Documents.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.status = "Approved";
    await doc.save();

    res.json({ success: true, message: "Document approved successfully." });
  } catch (err) {
    console.error("APPROVE DOCUMENT ERROR:", err);
    res.status(500).json({ error: "Failed to approve document" });
  }
};
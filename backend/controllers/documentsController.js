const Documents = require('../models/Documents');
const EmployeeRecords = require('../models/EmployeeRecords');
const Notification = require('../models/Notification'); // Create this model if not yet

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

    // Create a new EmployeeRecord with the approved document's data
    const employeeRecord = new EmployeeRecords({
      employeeId: doc.employeeId,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      dateUploaded: doc.dateUploaded,
      status: "Approved",
      formData: doc.formData // if you have extracted data
    });
    await employeeRecord.save();

    // Optionally delete the document from Documents collection
    await Documents.findByIdAndDelete(doc._id);

    // After approving a document
    await Notification.create({
      employeeId: doc.employeeId,
      type: "document",
      status: "approved",
      fileName: doc.fileName,
      date: new Date(),
      message: "Your document has been approved."
    });

    res.json({ success: true, message: "Document approved and moved to EmployeeRecords." });
  } catch (err) {
    console.error("APPROVE DOCUMENT ERROR:", err);
    res.status(500).json({ error: "Failed to approve and move document" });
  }
};

// Reject Document Controller
exports.rejectDocument = async (req, res) => {
  try {
    const doc = await Documents.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.status = "Rejected";
    doc.rejectionFeedback = req.body.feedback || "";
    await doc.save();

    // After rejecting a document
    await Notification.create({
      employeeId: doc.employeeId,
      type: "document",
      status: "rejected",
      fileName: doc.fileName,
      date: new Date(),
      message: `Your document was rejected. Reason: ${doc.rejectionFeedback}`
    });

    res.json({ success: true, message: "Document rejected.", feedback: doc.rejectionFeedback });
  } catch (err) {
    console.error("REJECT DOCUMENT ERROR:", err);
    res.status(500).json({ error: "Failed to reject document" });
  }
};
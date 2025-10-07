const Documents = require('../models/Documents');
const EmployeeRecords = require('../models/EmployeeRecords');
const Notification = require('../models/Notification');
const Employee = require('../models/Employees'); // Use your actual employee model filename

exports.createDocuments = async (req, res) => {
  try {
    const documents = new Documents({
      employeeId: req.body.employeeId,
      fileName: req.file ? req.file.originalname : undefined,
      fileUrl: req.file ? req.file.path : undefined,
      type: req.body.type,
      dateUploaded: new Date(),
      status: req.body.status || 'Pending',
      formData: req.body.formData // <-- Add this line
    });
    await documents.save();
    res.status(201).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to upload document.' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const docs = await Documents.find(filter)
      .populate('employeeId', 'surname firstname middlename extension');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const doc = await Documents.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Only update employee if this is a PDS document and has formData
    if (doc.type === "PDS" && doc.formData) {
      const employee = await Employee.findById(doc.employeeId);
      if (employee) {
        console.log("Approving PDS for employee:", doc.employeeId, doc.formData);
        Object.assign(employee, doc.formData); // Copy all PDS fields to employee
        employee.pdsStatus = "Approved";
        await employee.save();
      }
    }

    const employeeRecord = new EmployeeRecords({
      employeeId: doc.employeeId,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      dateUploaded: doc.dateUploaded,
      status: "Approved",
      formData: doc.formData
    });
    await employeeRecord.save();

    await Documents.findByIdAndDelete(doc._id);

    await Notification.create({
      employeeId: doc.employeeId,
      type: "document",
      status: "approved",
      fileName: doc.fileName,
      date: new Date(),
      message: "Your document has been approved."
    });

    res.json({ success: true, message: "Document approved and employee updated." });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve and update employee" });
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const doc = await Documents.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    doc.status = "Rejected";
    doc.rejectionFeedback = req.body.feedback || "";
    await doc.save();

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
    res.status(500).json({ error: "Failed to reject document" });
  }
};
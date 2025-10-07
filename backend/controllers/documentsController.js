const Documents = require('../models/Documents');
const EmployeeRecords = require('../models/EmployeeRecords');
const Notification = require('../models/Notification');
const Employee = require('../models/Employees');
const mammoth = require("mammoth");
const fs = require("fs");

function extractField(text, label) {
  // More robust regex: captures until newline or double space
  const match = text.match(new RegExp(label + "\\s*:?\\s*(.*?)(?:\\n|  |$)", "i"));
  return match ? match[1].trim() : "";
}

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

    let extractedFields = {};

    // If PDS and DOCX file exists, extract fields from DOCX
    if (doc.type === "PDS" && doc.fileUrl && fs.existsSync(doc.fileUrl)) {
      const buffer = fs.readFileSync(doc.fileUrl);
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;

      // Extract all major fields for modal display
      extractedFields = {
        // Personal Information
        surname: extractField(text, "2. SURNAME"),
        firstName: extractField(text, "FIRST NAME"),
        middleName: extractField(text, "MIDDLE NAME"),
        nameExt: extractField(text, "NAME EXTENSION"),
        dateOfBirth: extractField(text, "3. DATE OF BIRTH"),
        placeOfBirth: extractField(text, "4. PLACE OF BIRTH"),
        sex: extractField(text, "5. SEX"),
        civilStatus: extractField(text, "6. CIVIL STATUS"),
        height: extractField(text, "7. HEIGHT"),
        weight: extractField(text, "8. WEIGHT"),
        bloodType: extractField(text, "9. BLOOD TYPE"),
        gsis: extractField(text, "10. GSIS ID NO"),
        pagibig: extractField(text, "11. PAG-IBIG ID NO"),
        philhealth: extractField(text, "12. PHILHEALTH NO"),
        sss: extractField(text, "13. SSS NO"),
        tin: extractField(text, "14. TIN NO"),
        agencyEmployeeNo: extractField(text, "15. AGENCY EMPLOYEE NO"),
        citizenship: extractField(text, "16. CITIZENSHIP"),
        dualType: extractField(text, "Dual Citizenship Type"),
        citizenshipCountry: extractField(text, "Citizenship Country"),

        // Family Background
        spouse_surname: extractField(text, "SPOUSE'S SURNAME"),
        spouse_first: extractField(text, "SPOUSE'S FIRST NAME"),
        spouse_extension: extractField(text, "SPOUSE'S NAME EXTENSION"),
        spouse_middle: extractField(text, "SPOUSE'S MIDDLE NAME"),
        spouse_occupation: extractField(text, "SPOUSE'S OCCUPATION"),
        spouse_employer: extractField(text, "SPOUSE'S EMPLOYER/BUSINESS NAME"),
        spouse_businessAddress: extractField(text, "SPOUSE'S BUSINESS ADDRESS"),
        spouse_tel: extractField(text, "SPOUSE'S TELEPHONE NO"),
        father_surname: extractField(text, "FATHER'S SURNAME"),
        father_first: extractField(text, "FATHER'S FIRST NAME"),
        father_middle: extractField(text, "FATHER'S MIDDLE NAME"),
        father_ext: extractField(text, "FATHER'S NAME EXTENSION"),
        mother_surname: extractField(text, "MOTHER'S SURNAME"),
        mother_first: extractField(text, "MOTHER'S FIRST NAME"),
        mother_middle: extractField(text, "MOTHER'S MIDDLE NAME"),

        // Address
        res_houseNo: extractField(text, "RESIDENTIAL ADDRESS House/Block/Lot No"),
        res_street: extractField(text, "RESIDENTIAL ADDRESS Street"),
        res_subdivision: extractField(text, "RESIDENTIAL ADDRESS Subdivision/Village"),
        res_barangay: extractField(text, "RESIDENTIAL ADDRESS Barangay"),
        res_city: extractField(text, "RESIDENTIAL ADDRESS City/Municipality"),
        res_province: extractField(text, "RESIDENTIAL ADDRESS Province"),
        res_zip: extractField(text, "RESIDENTIAL ADDRESS ZIP CODE"),
        perm_houseNo: extractField(text, "PERMANENT ADDRESS House/Block/Lot No"),
        perm_street: extractField(text, "PERMANENT ADDRESS Street"),
        perm_subdivision: extractField(text, "PERMANENT ADDRESS Subdivision/Village"),
        perm_barangay: extractField(text, "PERMANENT ADDRESS Barangay"),
        perm_city: extractField(text, "PERMANENT ADDRESS City/Municipality"),
        perm_province: extractField(text, "PERMANENT ADDRESS Province"),
        perm_zip: extractField(text, "PERMANENT ADDRESS ZIP CODE"),

        // Contact
        telephone: extractField(text, "19. TELEPHONE NO"),
        mobile: extractField(text, "20. MOBILE NO"),
        email: extractField(text, "21. E-MAIL ADDRESS"),

        // Add more fields as needed for educational background, children, etc.
      };
    } else if (doc.type === "PDS" && doc.formData) {
      // Fallback to formData if no DOCX file
      extractedFields = doc.formData;
    }

    // Update employee record
    if (doc.type === "PDS") {
      const employee = await Employee.findById(doc.employeeId);
      if (employee) {
        Object.assign(employee, extractedFields);
        employee.pdsStatus = "Approved";
        await employee.save();
      }
    }

    // Move to EmployeeRecords
    const employeeRecord = new EmployeeRecords({
      employeeId: doc.employeeId,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      dateUploaded: doc.dateUploaded,
      status: "Approved",
      formData: doc.formData
    });
    await employeeRecord.save();

    // Remove from pending documents
    await Documents.findByIdAndDelete(doc._id);

    // Send notification
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

exports.deleteDocument = async (req, res) => {
  try {
    const result = await Documents.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Document not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
};

exports.extractPDSData = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const buffer = fs.readFileSync(req.file.path);
    const result = await mammoth.extractRawText({ buffer });
    // You can parse result.value here to extract fields
    res.json({ text: result.value });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to extract PDS data." });
  }
};
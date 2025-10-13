const PDS = require('../models/PDS');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
const util = require('util');
const libreConvert = util.promisify(libre.convert);

// Helper function for citizenship placeholders
function getCitizenshipPlaceholders(citizenship, dualType, country) {
  return {
    filipinoBox: citizenship === "Filipino" ? "✔" : "☐",
    dualBox: citizenship === "Dual" ? "✔" : "☐",
    byBirthBox: citizenship === "Dual" && dualType === "Birth" ? "✔" : "☐",
    byNaturalBox: citizenship === "Dual" && dualType === "Naturalization" ? "✔" : "☐",
    citizenshipCountry: citizenship === "Dual" ? country : ""
  };
}

// Helper function to find template
function findTemplatePath() {
  const possiblePaths = [
    path.join(__dirname, '../public/pds-template.docx'),
    path.join(__dirname, '../../public/pds-template.docx'),
    path.join(__dirname, '../pds-template.docx'),
    path.join(process.cwd(), 'public/pds-template.docx'),
    path.join(process.cwd(), 'backend/public/pds-template.docx'),
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }

  return null;
}

// Helper function to process form data
function processFormData(formData) {
  const citizenshipPlaceholders = getCitizenshipPlaceholders(
    formData.citizenship,
    formData.dualType,
    formData.citizenshipCountry
  );

  const filledData = {
    ...formData,
    // Sex checkboxes
    maleBox: formData.sex === "Male" ? "✔" : "☐",
    femaleBox: formData.sex === "Female" ? "✔" : "☐",

    // Civil status checkboxes
    singleBox: formData.civilStatus === "Single" ? "✔" : "☐",
    marriedBox: formData.civilStatus === "Married" ? "✔" : "☐",
    widowedBox: formData.civilStatus === "Widowed" ? "✔" : "☐",
    separatedBox: formData.civilStatus === "Separated" ? "✔" : "☐",
    otherBox: formData.civilStatus === "Other" ? "✔" : "☐",

    // Citizenship
    ...citizenshipPlaceholders,

    // Questions 34-40
    q34aYes: formData.q34a === "Yes" ? "✔" : "☐",
    q34aNo: formData.q34a === "No" ? "✔" : "☐",
    q34a_details: formData.q34a_details || "",

    q34bYes: formData.q34b === "Yes" ? "✔" : "☐",
    q34bNo: formData.q34b === "No" ? "✔" : "☐",
    q34b_details: formData.q34b_details || "",

    q35aYes: formData.q35a === "Yes" ? "✔" : "☐",
    q35aNo: formData.q35a === "No" ? "✔" : "☐",
    q35a_details: formData.q35a_details || "",

    q35bYes: formData.q35b === "Yes" ? "✔" : "☐",
    q35bNo: formData.q35b === "No" ? "✔" : "☐",
    q35b_details: formData.q35b_details || "",
    q35b_dateFiled: formData.q35b_dateFiled || "",
    q35b_status: formData.q35b_status || "",

    q36Yes: formData.q36 === "Yes" ? "✔" : "☐",
    q36No: formData.q36 === "No" ? "✔" : "☐",
    q36_details: formData.q36_details || "",

    q37Yes: formData.q37 === "Yes" ? "✔" : "☐",
    q37No: formData.q37 === "No" ? "✔" : "☐",
    q37_details: formData.q37_details || "",

    q38aYes: formData.q38a === "Yes" ? "✔" : "☐",
    q38aNo: formData.q38a === "No" ? "✔" : "☐",
    q38a_details: formData.q38a_details || "",

    q38bYes: formData.q38b === "Yes" ? "✔" : "☐",
    q38bNo: formData.q38b === "No" ? "✔" : "☐",
    q38b_details: formData.q38b_details || "",

    q39Yes: formData.q39 === "Yes" ? "✔" : "☐",
    q39No: formData.q39 === "No" ? "✔" : "☐",
    q39_details: formData.q39_details || "",

    q40aYes: formData.q40a === "Yes" ? "✔" : "☐",
    q40aNo: formData.q40a === "No" ? "✔" : "☐",
    q40a_details: formData.q40a_details || "",

    q40bYes: formData.q40b === "Yes" ? "✔" : "☐",
    q40bNo: formData.q40b === "No" ? "✔" : "☐",
    q40b_details: formData.q40b_details || "",

    q40cYes: formData.q40c === "Yes" ? "✔" : "☐",
    q40cNo: formData.q40c === "No" ? "✔" : "☐",
    q40c_details: formData.q40c_details || "",

    // Address placeholders
    res_houseNo: formData.res_houseNo || "",
    res_street: formData.res_street || "",
    res_subdivision: formData.res_subdivision || "",
    res_barangay: formData.res_barangay || "",
    res_city: formData.res_city || "",
    res_province: formData.res_province || "",
    res_zip: formData.res_zip || "",

    perm_houseNo: formData.perm_houseNo || "",
    perm_street: formData.perm_street || "",
    perm_subdivision: formData.perm_subdivision || "",
    perm_barangay: formData.perm_barangay || "",
    perm_city: formData.perm_city || "",
    perm_province: formData.perm_province || "",
    perm_zip: formData.perm_zip || "",
  };

  // Pad children array to 12 items if exists
  if (!Array.isArray(filledData.children)) {
    filledData.children = [];
  }
  while (filledData.children.length < 12) {
    filledData.children.push({ name: "", dob: "" });
  }

  return filledData;
}

// ============================================
// DOCX PREVIEW (Original)
// ============================================
exports.generatePreview = async (req, res) => {
  try {
    console.log('📄 DOCX Preview request received');
    
    const { formData } = req.body;

    if (!formData) {
      console.log('❌ No form data provided');
      return res.status(400).json({ error: "Form data is required" });
    }

    console.log('📋 Form data received, generating DOCX preview...');

    // Find template
    const templatePath = findTemplatePath();
    
    if (!templatePath) {
      console.log('❌ Template not found');
      return res.status(404).json({ error: "PDS template not found" });
    }

    console.log('✅ Template found at:', templatePath);

    // Read template
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { 
      paragraphLoop: true, 
      linebreaks: true 
    });

    // Process form data
    const filledData = processFormData(formData);

    console.log('🔧 Rendering DOCX document...');
    doc.render(filledData);

    console.log('📦 Generating DOCX buffer...');
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    console.log('✅ DOCX preview generated successfully, size:', buffer.length, 'bytes');

    // Send as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'inline; filename="PDS_Preview.docx"');
    res.send(buffer);

  } catch (error) {
    console.error('❌ DOCX preview generation error:', error);
    res.status(500).json({ 
      error: error.message || "Failed to generate DOCX preview",
      details: error.toString()
    });
  }
};

// ============================================
// PDF PREVIEW (NEW - Displays in Browser)
// ============================================
exports.generatePreviewPDF = async (req, res) => {
  try {
    console.log('📄 PDF Preview request received');
    
    const { formData } = req.body;

    if (!formData) {
      console.log('❌ No form data provided');
      return res.status(400).json({ error: "Form data is required" });
    }

    console.log('📋 Form data received, generating PDF preview...');

    // Find template
    const templatePath = findTemplatePath();
    
    if (!templatePath) {
      console.log('❌ Template not found');
      return res.status(404).json({ error: "PDS template not found" });
    }

    console.log('✅ Template found at:', templatePath);

    // Read template
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { 
      paragraphLoop: true, 
      linebreaks: true 
    });

    // Process form data
    const filledData = processFormData(formData);

    console.log('🔧 Rendering DOCX document...');
    doc.render(filledData);

    console.log('📦 Generating DOCX buffer...');
    const docxBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    console.log('🔄 Converting DOCX to PDF...');

    // Convert DOCX to PDF
    const pdfBuffer = await libreConvert(docxBuffer, '.pdf', undefined);

    console.log('✅ PDF preview generated successfully, size:', pdfBuffer.length, 'bytes');

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="PDS_Preview.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ PDF preview generation error:', error);
    
    // Check if it's a LibreOffice error
    if (error.message && error.message.includes('LibreOffice')) {
      return res.status(500).json({ 
        error: "LibreOffice conversion failed. Make sure LibreOffice is installed on the server.",
        details: error.message,
        instructions: "Install LibreOffice: https://www.libreoffice.org/download/download/"
      });
    }

    res.status(500).json({ 
      error: error.message || "Failed to generate PDF preview",
      details: error.toString()
    });
  }
};

// ============================================
// EXISTING FUNCTIONS (Keep as is)
// ============================================

// Create PDS (with file upload if any)
exports.createPDS = async (req, res) => {
  try {
    const { employeeId, formData, status } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const pds = new PDS({
      employeeId,
      formData: formData ? JSON.parse(formData) : {},
      fileName: req.file ? req.file.originalname : undefined,
      fileUrl: req.file ? req.file.path : undefined,
      dateUploaded: new Date(),
      status: status || "Pending"
    });

    await pds.save();
    res.status(201).json({ message: "PDS saved successfully", pds });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save PDS." });
  }
};

// Create PDS (form-only, no file)
exports.createPDSForm = async (req, res) => {
  try {
    const { employeeId, formData, status } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const pds = new PDS({
      employeeId,
      formData,
      dateUploaded: new Date(),
      status: status || "Pending"
    });

    await pds.save();
    res.status(201).json({ message: "PDS form saved successfully", pds });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save PDS form data." });
  }
};

// Get all PDS
exports.getAllPDS = async (req, res) => {
  try {
    const docs = await PDS.find()
      .populate("employeeId", "name email beamsId role status")
      .lean();

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch PDS documents." });
  }
};

// Update PDS by ID
exports.updatePDS = async (req, res) => {
  try {
    const updated = await PDS.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "PDS not found" });
    }

    res.json({ message: "PDS updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update PDS." });
  }
};

// Delete PDS by ID
exports.deletePDS = async (req, res) => {
  try {
    const deleted = await PDS.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "PDS not found" });
    }

    res.json({ message: "PDS deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete PDS." });
  }
};
const PDS = require('../models/PDS');

// Create PDS (with file upload if any)
exports.createPDS = async (req, res) => {
  try {
    const { employeeId, formData, status } = req.body;

    // 🔒 Validate employeeId
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

exports.getAllPDS = async (req, res) => {
  try {
    const docs = await PDS.find()
      .populate("employeeId", "name email beamsId role status") // only include needed fields
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

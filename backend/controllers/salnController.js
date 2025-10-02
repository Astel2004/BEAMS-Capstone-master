const SALN = require("../models/SALN");

// Create SALN (form-only)
exports.createSALNForm = async (req, res) => {
  try {
    const { employeeId, formData, status } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const saln = new SALN({
      employeeId,
      formData,
      dateUploaded: new Date(),
      status: status || "Pending",
    });

    await saln.save();
    res.status(201).json({ message: "SALN form saved successfully", saln });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to save SALN form data." });
  }
};

// Get all SALNs
exports.getAllSALN = async (req, res) => {
  try {
    const docs = await SALN.find().lean();
    res.json(docs);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch SALN documents." });
  }
};

// Update SALN by ID
exports.updateSALN = async (req, res) => {
  try {
    const updated = await SALN.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "SALN not found" });
    }

    res.json({ message: "SALN updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update SALN." });
  }
};

// Delete SALN by ID
exports.deleteSALN = async (req, res) => {
  try {
    const deleted = await SALN.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "SALN not found" });
    }

    res.json({ message: "SALN deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete SALN." });
  }
};

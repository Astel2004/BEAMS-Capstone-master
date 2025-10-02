const mongoose = require("mongoose");

const SALNSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  // For uploaded files
  fileName: { type: String },
  fileUrl: { type: String },

  // For form-only submissions
  formData: { type: Object }, // flexible JSON object for form fields

  dateUploaded: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("SALN", SALNSchema);

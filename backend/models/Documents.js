const mongoose = require('mongoose');

const PendingDocumentsSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fileName: { type: String },
  fileUrl: { type: String },
  type: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  dateUploaded: { type: Date, default: Date.now },
  rejectionFeedback: { type: String } 
});

module.exports = mongoose.model('PendingDocuments', PendingDocumentsSchema);
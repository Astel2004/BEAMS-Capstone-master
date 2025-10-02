const mongoose = require('mongoose');

const DocumentsSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fileName: { type: String }, // <-- removed requiredrequired
  fileUrl: { type: String },  // <-- removed required required
  dateUploaded: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Documents', DocumentsSchema);
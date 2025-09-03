const mongoose = require('mongoose');

const PDSSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('PDS', PDSSchema);
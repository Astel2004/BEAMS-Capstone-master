const mongoose = require('mongoose');

const EmployeeRecordsSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  formData: { type: Object } // Add this line if you want to store form data
});

module.exports = mongoose.model('EmployeeRecords', EmployeeRecordsSchema);
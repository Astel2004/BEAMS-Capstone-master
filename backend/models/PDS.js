const mongoose = require('mongoose');

const PDSSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },

  // For uploaded files
  fileName: { type: String },
  fileUrl: { type: String },

  // For form-only submissions
  formData: { type: Object },   // can hold dynamic key-value pairs

  dateUploaded: { type: Date, default: Date.now },

  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
});

module.exports = mongoose.model('PDS', PDSSchema);

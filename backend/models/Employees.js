const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  firstname: { type: String, required: true },
  middlename: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: false }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
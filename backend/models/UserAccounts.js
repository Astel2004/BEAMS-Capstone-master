const mongoose = require('mongoose');

const userAccountsSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: "Active" }
});

module.exports = mongoose.model('UserAccounts', userAccountsSchema);

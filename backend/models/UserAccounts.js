const mongoose = require('mongoose');

const userAccountsSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  name: String,
  email: String,
  password: String,
  role: String,
});

module.exports = mongoose.model('UserAccounts', userAccountsSchema);
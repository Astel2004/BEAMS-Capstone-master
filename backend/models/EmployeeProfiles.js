const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Link to user
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
});

const Documents = mongoose.model('Documents', documentsSchema);

module.exports = Documents;
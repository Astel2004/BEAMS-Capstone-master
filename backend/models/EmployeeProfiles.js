const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Link to user
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  pds: { type: String }, // Path to uploaded PDS file
  saln: { type: String }, // Path to uploaded SALN file
  documents: [{ type: String }], // Array of paths to uploaded documents
});

const Documents = mongoose.model('Documents', documentsSchema);

module.exports = Documents;
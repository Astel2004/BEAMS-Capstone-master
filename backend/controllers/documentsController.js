const Employee = require('../models/Documents'); // Import the Employee model

// Save or Update Employee Record
const saveEmployeeRecord = async (req, res) => {
  const { username, fullName, position, department } = req.body;

  try {
    let employee = await Employee.findOne({ username });

    if (employee) {
      // Update existing record
      employee.fullName = fullName;
      employee.position = position;
      employee.department = department;
    } else {
      // Create new record
      employee = new Employee({ username, fullName, position, department });
    }

    await employee.save();
    res.status(200).json({ message: 'Employee record saved successfully!' });
  } catch (error) {
    console.error('Error saving employee record:', error);
    res.status(500).json({ error: 'Failed to save employee record.' });
  }
};

// Upload Documents (if needed in the future)
const uploadDocuments = async (req, res) => {
  const { username } = req.body;
  const files = req.files; // Assuming you're using multer for file uploads

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Save file paths to the employee record
    files.forEach((file) => {
      employee.documents.push(file.path);
    });

    await employee.save();
    res.status(200).json({ message: 'Documents uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Failed to upload documents.' });
  }
};

// Add PSA and SALN
const addPSAAndSALN = async (req, res) => {
  const { username, psa, saln } = req.body;

  try {
    let employee = await Employee.findOne({ username });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Add PSA and SALN details
    employee.psa = psa;
    employee.saln = saln;

    await employee.save();
    res.status(200).json({ message: 'PSA and SALN added successfully!' });
  } catch (error) {
    console.error('Error adding PSA and SALN:', error);
    res.status(500).json({ error: 'Failed to add PSA and SALN.' });
  }
};

// Update PSA and SALN
const updatePSAAndSALN = async (req, res) => {
  const { username, psa, saln } = req.body;

  try {
    let employee = await Employee.findOne({ username });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Update PSA and SALN details
    if (psa) employee.psa = psa;
    if (saln) employee.saln = saln;

    await employee.save();
    res.status(200).json({ message: 'PSA and SALN updated successfully!' });
  } catch (error) {
    console.error('Error updating PSA and SALN:', error);
    res.status(500).json({ error: 'Failed to update PSA and SALN.' });
  }
};

// Delete PSA and SALN
const deletePSAAndSALN = async (req, res) => {
  const { username } = req.body;

  try {
    let employee = await Employee.findOne({ username });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Remove PSA and SALN details
    employee.psa = null;
    employee.saln = null;

    await employee.save();
    res.status(200).json({ message: 'PSA and SALN deleted successfully!' });
  } catch (error) {
    console.error('Error deleting PSA and SALN:', error);
    res.status(500).json({ error: 'Failed to delete PSA and SALN.' });
  }
};

module.exports = {
  saveEmployeeRecord,
  uploadDocuments,
  addPSAAndSALN,
  updatePSAAndSALN,
  deletePSAAndSALN,
};
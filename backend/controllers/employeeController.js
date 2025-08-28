const bcrypt = require('bcrypt');
const Employee = require('../models/Employees'); // Import the Employee model
const UserAccounts = require('../models/UserAccounts'); // Import your user model
const jwt = require('jsonwebtoken');

// Create a new employee

const createEmployee = async (req, res) => {
  const {
    surname,
    firstname,
    middlename,
    extension,
    civilStatus,
    citizenship,
    mobileNo,
    email,
    birthdate,
    gender,
    address,
    status,
    position,
    step,
    id
  } = req.body;

  try {
    // Debug: log the received body
    console.log('Received body:', req.body);

    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee email already exists' });
    }


    // Create a new employee (no password field in schema, so don't hash or save it)
    const newEmployee = new Employee({
      surname,
      firstname,
      middlename,
      extension,
      civilStatus,
      citizenship,
      mobileNo,
      email,
      birthdate,
      gender,
      address,
      status,
      position,
      step,
      id
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id); // Find by MongoDB _id
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

// Update an employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    // Delete the user account linked to this employee
    await UserAccounts.findOneAndDelete({ employeeId: employee._id });
    res.json({ message: 'Employee and user account deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
const express = require('express');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByCustomId,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const router = express.Router();

router.post('/', createEmployee); // Create a new employee
router.get('/', getAllEmployees); // Get all employees
router.get('/:id', getEmployeeById); // Get a single employee by custom ID
router.get('/custom/:customId', getEmployeeByCustomId); // Get a single employee by custom ID
router.put('/:id', updateEmployee); // Update an employee by custom ID
router.delete('/:id', deleteEmployee); // Delete an employee by custom ID

module.exports = router;
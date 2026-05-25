const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/stats', employeeController.getStats);
router.get('/', employeeController.getAllEmployees);
router.post('/add', employeeController.addEmployee);
router.put('/update/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;
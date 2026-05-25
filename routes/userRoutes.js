const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User List
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
// Dashboard Stats
router.get('stats', authMiddleware, adminMiddleware, userController.getStats);

//New User adding
router.post('/add', authMiddleware, adminMiddleware, userController.registerUser);

// Edit User Details
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);

// Delete User
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth Routes
router.post('/register', authController.registerUser);
//router.get('/verify', authController.verifyEmail);
router.post('/login', authController.loginUser);

// Profile Routes (authMiddleware ഉപയോഗിക്കുന്നത് ഇവിടെയാണ്)
router.get('/me', authMiddleware, authController.getMyProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/CustomerController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// 1. കസ്റ്റമർ റൂട്ടുകൾ

// അഡ്മിൻ മാത്രം ആക്സസ് ചെയ്യേണ്ടവ (adminMiddleware ഉൾപ്പെടുത്തി)
router.post('/add', authMiddleware, adminMiddleware, customerController.addCustomer);
router.put('/update/:id', authMiddleware, adminMiddleware, customerController.updateCustomer);
router.delete('/delete/:id', authMiddleware, adminMiddleware, customerController.deleteCustomer);

// കസ്റ്റമറിനും അഡ്മിനും കാണാൻ കഴിയുന്നവ (adminMiddleware ഒഴിവാക്കി)
router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/profile/:id', authMiddleware, customerController.getCustomerProfile);

module.exports = router;
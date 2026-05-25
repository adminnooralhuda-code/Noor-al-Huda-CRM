const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const expiryController = require('../controllers/expiryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


//1. expiry details fetch ചെയ്യാൻ(ippol controller l ninnum varunnu)
router.get('/expiry-list', authMiddleware, adminMiddleware, expiryController.getCombinedExpiryList);

//2.  കമ്പനി admin routes
router.post('/add', authMiddleware, adminMiddleware, companyController.addCompany);
router.put('/update/:id', authMiddleware, adminMiddleware, companyController.updateCompany);

//3. General Routes
router.get('/', authMiddleware, companyController.getAllCompanies);
router.get('/:id', authMiddleware, companyController.getCompanyById);

module.exports = router;
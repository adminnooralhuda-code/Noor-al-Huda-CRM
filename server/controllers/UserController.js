const User = require('../models/User');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const bcrypt = require('bcrypt');

// Register a new user (company അസൈൻ ചെയ്യുന്ന ലോജിക് കൂടി ചേർത്തു)
exports.registerUser = async (req, res) => {
    try {
        const { email, password, role, company } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // കസ്റ്റമർ ആണെങ്കിൽ മാത്രം കമ്പനി ഐഡി സേവ് ചെയ്യുന്നു
        const newUser = new User({ 
            email, 
            password: hashedPassword, 
            role, 
            company: role === 'customer' ? company : null 
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all users (കമ്പനി വിവരങ്ങൾ കാണിക്കാൻ .populate ചേർത്തു)
// userController.js
exports.getAllUsers = async (req, res) => {
    try {
        // lean() ചേർക്കുന്നത് MongoDB-യിൽ നിന്നുള്ള ഡാറ്റ വേഗത്തിൽ കിട്ടാനും എറർ കുറയ്ക്കാനും സഹായിക്കും
        const users = await User.find().select('-password').populate('company', 'companyNameEn').lean();
        res.json(users);
    } catch (err) {
        console.error("Backend Error:", err); 
        res.status(500).json({ error: "Server Error" });
    }
};

// Update a user (Role-ഉം Company-യും അപ്‌ഡേറ്റ് ചെയ്യുന്നു)
exports.updateUser = async (req, res) => {
    try {
        const { role, company } = req.body;
        
        // കസ്റ്റമർ ആണെങ്കിൽ മാത്രം കമ്പനി അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        const updateData = {
            role,
            company: role === 'customer' ? company : null
        };

        const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true});
        if (!updated) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a user (മറ്റെന്തിനും മാറ്റമില്ല)
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//5. Get Dashboard Stats (മറ്റെന്തിനും മാറ്റമില്ല)
exports.getStats = async (req, res) => {
    try {

        const today = new Date();

        const [empCount, compCount, userCount, empExpCount, compExpCount] = await Promise.all([
            Employee.countDocuments(),
            Company.countDocuments(),
            User.countDocuments(),
            Employee.countDocuments({
                $or: [
                    { passportExpiry: { $lt: today } },
                    { emiratesIdExpiry: { $lt: today } },
                    { labourCardExpiry: { $lt: today } },
                    { iloeExpiry: { $lt: today } },
                    { insuranceExpiry: { $lt: today } }
                ]
            }),
            Company.countDocuments({
                $or: [
                    { licenseExpiry: { $lt: today } },
                    { establishmentCardExpiry: { $lt: today } },
                    { eChannelExpiry: { $lt: today } },
                    { companyInsuranceExpiry: { $lt: today } },
                    { leaseExpiry: { $lt: today } }
                ]
            })
        ]);

        res.json({empCount, compCount, userCount, expiryCount: empExpCount + compExpCount});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
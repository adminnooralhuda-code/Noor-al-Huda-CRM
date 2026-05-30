const User = require('../models/User');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const bcrypt = require('bcrypt');

// 1. Register a new user
exports.registerUser = async (req, res) => {
    try {
        // 'username' body-il ninnu extract cheyyuka
        const { username, email, password, role, company } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            username, // Ithu add cheyyuka
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

// 2. Get all users
exports.getAllUsers = async (req, res) => {
    try {
        // password ഒഴിവാക്കി username കൂടി ഉൾപ്പെടുത്തി ഡാറ്റ എടുക്കുന്നു
        const users = await User.find().select('-password').populate('company', 'companyNameEn').lean();
        res.json(users);
    } catch (err) {
        console.error("Backend Error:", err); 
        res.status(500).json({ error: "Server Error" });
    }
};

// 3. Update a user
exports.updateUser = async (req, res) => {
    try {
        const { username, role, company } = req.body; // username കൂടെ എടുത്തു
        
        const updateData = {
            username, // അപ്‌ഡേറ്റ് ലിസ്റ്റിൽ ചേർത്തു
            role,
            company: role === 'customer' ? company : null
        };

        const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Get Dashboard Stats
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
const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');

// പുതിയ കസ്റ്റമറെ ചേർക്കാൻ
exports.addCustomer = async (req, res) => {
    try {
        const { name, mobileNo, email, password, company } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // കമ്പനി അസൈൻ ചെയ്തിട്ടില്ലെങ്കിൽ (Empty String) null ആക്കി മാറ്റുന്നു
        const newCustomer = new Customer({ 
            name, 
            mobileNo, 
            email, 
            password: hashedPassword, 
            company: company || null 
        });
        
        await newCustomer.save();
        res.status(201).json({ message: "Customer added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// എല്ലാ കസ്റ്റമേഴ്സിനെയും കാണിക്കാൻ
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('company', 'companyNameEn').lean();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// കസ്റ്റമർ പ്രൊഫൈൽ എടുക്കാൻ (Customer Dashboard-ന് വേണ്ടി)
exports.getCustomerProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate('company').lean();
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// കസ്റ്റമർ വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യാൻ
exports.updateCustomer = async (req, res) => {
    try {
        const { name, mobileNo, company } = req.body;
        
        const updateData = { 
            name, 
            mobileNo, 
            company: company || null 
        };

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });
        res.json({ message: "Customer updated successfully", updatedCustomer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// കസ്റ്റമറെ ഡിലീറ്റ് ചെയ്യാൻ
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
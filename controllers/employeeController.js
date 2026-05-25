const Employee = require('../models/Employee');
const Company = require('../models/Company');

//expiry fieldukal manage chayyanulla configuration

const EXPIRY_CONFIG = [
    { key: 'passportExpiry', label: 'Passport' },
    { key: 'emiratesIdExpiry', label: 'Emirates ID' },
    { key: 'labourCardExpiry', label: 'Labour Card' },
    { key: 'insuranceExpiry', label: 'Insurance' },
    { key: 'iloeExpiry', label: 'ILOE' }        
];

const COMP_EXPIRY_CONFIG = [
    { key: 'licenseExpiry', label: 'Company License' },
    { key: 'establishmentCardExpiry', label: 'Est. Card' },
    { key: 'eChannelExpiry', label: 'E-Channel' },
    { key: 'companyInsuranceExpiry', label: 'Company Insurance' }
];


// എല്ലാ എംപ്ലോയികളെയും എടുക്കാൻ
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('company');
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// clean cheytha status logic
exports.getStats = async (req, res) => {
    try {
        const [employees, companies] = await Promise.all([
            Employee.find().lean(),
            Company.find().lean()
        ]);

        const today = new Date();
        let expiryCount = 0;


        // Employee expiry check
            employees.forEach(emp => {
                EXPIRY_CONFIG.forEach(f => {
                    if (emp[f.key] && (new Date(emp[f.key]) - today) / (1000 * 60 * 60 * 24) <= 30) {
                        expiryCount++;
                    }
                });
            });


            // Company expiry check
            companies.forEach(comp => {
                COMP_EXPIRY_CONFIG.forEach(f => {
                    if (comp[f.key] && (new Date(comp[f.key]) - today) / (1000 * 60 * 60 * 24) <= 30) {
                        expiryCount++;
                    }
                });
            });
            res.json({ 
                empCount: employees.length, 
                compCount: companies.length, 
                expiryCount: expiryCount 
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};


// പുതിയ എംപ്ലോയിയെ ചേർക്കാൻ
exports.addEmployee = async (req, res) => {
    try {
        const employeeData = { ...req.body, employeeId: "EMP-" + Date.now().toString().slice(-6) };
        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// update, delete, get by id functions

exports.updateEmployee = async (req, res) => {
    try {
        const { company, ...otherData } = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { ...otherData, company: company },
            { new: true }
        );
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};


exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('company');
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};



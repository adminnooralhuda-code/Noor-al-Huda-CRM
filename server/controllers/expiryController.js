const Company = require('../models/Company');
const Employee = require('../models/Employee');

exports.getCombinedExpiryList = async (req, res) => {
    try {
        const [companies, employees] = await Promise.all([
            Company.find().lean(),
            Employee.find().lean()
        ]);

        const combinedList = [];

        // configuration

        const compFields = [
            { key: 'licenseExpiry', label: 'Company License' },
            { key: 'establishmentCardExpiry', label: 'Est. Card' },
            { key: 'eChannelExpiry', label: 'E-Channel' },
            { key: 'companyInsuranceExpiry', label: 'Company Insurance' }
        ];

        const empFields = [
            { key: 'passportExpiry', label: 'Passport' },
            { key: 'emiratesIdExpiry', label: 'Emirates ID' },
            { key: 'labourCardExpiry', label: 'Labour Card' },
            { key: 'insuranceExpiry', label: 'Insurance' },
            { key: 'iloeExpiry', label: 'ILOE' }
        ];

        // company loop
        companies.forEach(comp => {
            compFields.forEach(f => {
                if (comp[f.key]) combinedList.push({name: comp.companyNameEn, type: f.label, expiryDate: comp[f.key]});
            });
        });

        // employee loop
        employees.forEach(e => {
            empFields.forEach(f => {
                if (e[f.key]) combinedList.push({name: e.name, type: f.label, expiryDate: e[f.key]});
            });
        });

        combinedList.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        res.json(combinedList.slice(0, 15)); // top 15 expiring items
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
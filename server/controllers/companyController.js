const Company = require('../models/Company');

exports.addCompany = async (req, res) => {
    try {
        // അവസാനത്തെ കമ്പനി കണ്ടെത്തുന്നു
        const lastCompany = await Company.findOne().sort({ createdAt: -1 });

        let newCode = "C-001";
        if (lastCompany && lastCompany.companyCode) {
            const lastNumber = parseInt(lastCompany.companyCode.split('-')[1]);
            newCode = `C-${(lastNumber + 1).toString().padStart(3, '0')}`;
        }

        // കമ്പനി സേവ് ചെയ്യുന്നു
        const newCompany = new Company({
            ...req.body,
            companyCode: newCode // കോഡ് ഇവിടെ നൽകുന്നു
        });

        await newCompany.save();
        res.status(201).json({ message: "Company added!", data: newCompany });
    } catch (error) {
        res.status(500).json({ message: "Failed to add company", error: error.message });
    }
};

//2. എല്ലാ കമ്പനികളെയും കാണിക്കാൻ
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().lean();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch companies", error: error.message });
    }
};

//3.ID VECH EDUKKUMBO EXPIRY DATE ORU ARRAY AAYI KITTAN (AN ADVANCED SYSTEM)

exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).lean();
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        //IVIDE NAMML COMPANY EXPIRE DETAIL ORU ARRAY AAYI MAATUNNU
        const expiryList = [
            {type:'Company License', expiryDate: company.licenseExpiry},
            {type:'Est. Card', expiryDate: company.establishmentCardExpiry},
            {type:'E-Channel', expiryDate: company.eChannelExpiry},
            {type:'Insurance', expiryDate: company.companyInsuranceExpiry}
        ].filter(item => item.expiryDate); // Filter out items without expiry dates

        //company yude koode ee array koodi add cheyth ayakkunnu

        res.status(200).json({ ...company, expiryList });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch company", error: error.message });
    }
};


// പഴയ കോഡിന്റെ കൂടെ ഇതും കൂടി ചേർക്കുക
exports.updateCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // അപ്‌ഡേറ്റ് ചെയ്ത ഡാറ്റ തിരികെ ലഭിക്കാൻ
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json({ message: "Company updated successfully!", data: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Failed to update company", error: error.message });
    }
};


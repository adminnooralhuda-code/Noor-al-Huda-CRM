const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyCode: { 
        type: String, 
        unique: true,
        default: "C-000"
    },
    companyNameEn: String,
    companyNameAr: String,
    companyNumber: String,
    estDate: Date,
    issueDate: Date,
    
    // --- എക്സ്പയറി ട്രാക്കിംഗിനായുള്ള ഫീൽഡുകൾ ---
    licenseExpiry: Date,
    establishmentCardExpiry: Date,
    eChannelExpiry: Date,
    companyInsuranceExpiry: Date,
    
    legalForm: String,
    ownerName: String,
    ownerRole: String,
    managerName: String,
    managerMobile: String,
    activity: String,
    leaseNo: String,
    leaseExpiry: Date,
    email: String,
    icpCard: String,
    mohreNo: String,
    damanPolicy: String,
    contactName: String,
    contactMobile: String
}, { timestamps: true }); // ഒരൊറ്റ തവണ മാത്രം ഇത് മതി

module.exports = mongoose.model('Company', companySchema);
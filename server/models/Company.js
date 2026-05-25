const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    // models/Company.js
companyCode: { 
    type: String, 
    unique: true, 
    sparse: true // ഈ sparse: true ചേർത്താൽ null വാല്യൂകളെ അത് ഡ്യൂപ്ലിക്കേറ്റ് ആയി കാണില്ല
},
    companyNameEn: String,
    companyNameAr: String,
    companyNumber: String,
    estDate: Date,
    issueDate: Date,
    
    // --- എക്സ്പയറി ട്രാക്കിംഗിനായുള്ള പുതിയ ഫീൽഡുകൾ ---
    licenseExpiry: Date,            // Company License Expiry
    establishmentCardExpiry: Date,  // Establishment Card Expiry
    eChannelExpiry: Date,           // Echannel Expiry
    companyInsuranceExpiry: Date,   // Company Insurance Expiry
    // --------------------------------------------------

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
});

module.exports = mongoose.model('Company', companySchema);
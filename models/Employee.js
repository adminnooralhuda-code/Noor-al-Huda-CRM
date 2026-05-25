const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: false }, 
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    name: String,
    designation: String,
    nationality: String,
    
    // --- എക്സ്പയറി ട്രാക്കിംഗിനായുള്ള ഫീൽഡുകൾ ---
    passportNo: String,
    passportExpiry: Date,         // passportExpiryDate എന്നതിന് പകരം passportExpiry (Consistency-ക്ക് വേണ്ടി)
    
    emiratesIdNo: String,
    emiratesIdExpiry: Date,       // emiratesIdExpiryDate എന്നതിന് പകരം emiratesIdExpiry
    
    labourCardNo: String,
    labourCardExpiry: Date,       // labourCardExpiryDate എന്നതിന് പകരം labourCardExpiry
    
    iloeExpiry: Date,             // iloeExpiryDate എന്നതിന് പകരം iloeExpiry
    
    insurance: String,
    insuranceExpiry: Date,        // insuranceExpiryDate എന്നതിന് പകരം insuranceExpiry
    // ---------------------------------------------
    
    dob: Date,
    mobileNo: String,
    email: String
});

module.exports = mongoose.model('Employee', employeeSchema);
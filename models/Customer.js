const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: false // ഇത് 'false' ആക്കിയാൽ കമ്പനി ഇല്ലാതെയും കസ്റ്റമറെ സേവ് ചെയ്യാം
    }
});

module.exports = mongoose.model('Customer', customerSchema);
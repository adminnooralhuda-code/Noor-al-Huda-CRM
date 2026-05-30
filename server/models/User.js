const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Username ഫീൽഡ് ഇവിടെ ചേർത്തു
    username: { 
        type: String, 
        required: false, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'staff', 'customer'], 
        default: 'customer' 
    },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: false 
    }
}, { timestamps: true }); // എപ്പോഴാണ് ക്രിയേറ്റ് ചെയ്തതെന്ന് അറിയാൻ ഇത് സഹായിക്കും

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'staff', 'customer'], 
        default: 'customer' 
    },
    // ഈ ഫീൽഡ് നിർബന്ധമായും ചേർക്കണം
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: false 
    }
});

module.exports = mongoose.model('User', userSchema);
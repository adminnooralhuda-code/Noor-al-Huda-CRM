import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Manager', 'Staff', 'Customer'], 
    default: 'Staff' 
  },
  // Customer-ക്കോ Staff-നോ ഒന്നിലധികം കമ്പനികളുടെ ആക്സസ് നൽകാൻ
  assignedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
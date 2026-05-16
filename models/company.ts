import mongoose, { Schema, model, models } from 'mongoose';

const OwnerSchema = new Schema({
  isCompany: { type: Boolean, default: false },
  role: String,
  nationality: String,
  name: String,
  emiratesId: String,
  eIdExpiry: String,
  insuranceNo: String,
  insuranceExpiry: String,
  mobile: String,
  companyNo: String,
  companyName: String,
  issuePlace: String,
  contactPerson: String,
  contactNumber: String
});

const ManagerSchema = new Schema({
  role: String,
  nationality: String,
  name: String,
  mobile: String
});

const CompanySchema = new Schema({
  companyCode: { type: String, required: true, unique: true },
  nameEn: { type: String, required: true },
  nameAr: String,
  dedNumber: String,
  establishmentDate: String,
  issuanceDate: String,
  expiryDate: String, // Automatic Expiry Tracking-ന് ഉപയോഗിക്കുന്നത്
  legalForm: { type: String, default: 'Establishment' },
  owners: [OwnerSchema],
  managers: [ManagerSchema],
  activities: [String],
  hasLease: { type: String, default: 'No' },
  leaseNumber: String,
  leaseExpiry: String,
  leasePlace: String,
  companyEmail: String,
  companyMobile: String,
  icpCardNumber: String,
  eChannelUser: String,
  eChannelPass: String,
  icpIssueDate: String,
  icpExpiryDate: String,
  mohreNumber: String,
  mohreLastUpdate: String,
  damanPolicy: String,
  damanExpiry: String,
  damanTotalMembers: String,
  contactPersonDetails: String
}, { timestamps: true });

// Next.js സർവർ റീലോഡ് ചെയ്യുമ്പോൾ മോഡൽ വീണ്ടും ക്രിയേറ്റ് ചെയ്യാതിരിക്കാനുള്ള മുൻകരുതൽ
export default models.Company || model('Company', CompanySchema);
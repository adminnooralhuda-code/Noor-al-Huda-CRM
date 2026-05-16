import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  isCompany: { type: Boolean, default: false }, // Checkbox for Individual or Company
  // If Individual
  rolePosition: String,
  nationality: String,
  name: String,
  emiratesId: String,
  emiratesIdExpiry: String,
  insuranceNumber: String, // For non-locals
  insuranceExpiry: String,
  mobileNo: String,
  // If Company
  companyNo: String,
  companyName: String,
  companyIssuePlace: String,
  companyContactPerson: String,
  contactNumber: String
});

const CompanySchema = new mongoose.Schema({
  companyCode: { type: String, unique: true }, // Auto-generated (C-001...)
  nameEn: String,
  nameAr: String,
  dedNumber: String, // CN/IN-NUMBER
  establishmentDate: String,
  issuanceDate: String,
  expiryDate: String,
  legalForm: { 
    type: String, 
    enum: ['Limited Liability Company- sole proprietorship Company', 'limited Liability Company', 'Establishment']
  },
  
  // Ownership details based on Legal Form
  owners: [OwnerSchema],
  
  // Manager Option inside Company
  managerDetails: {
    rolePosition: String,
    nationality: String,
    name: String,
    mobileNo: String
  },

  // License Activities (Dynamic arrays)
  activities: [String],

  // Address & Lease Contract
  hasLeaseContract: { type: Boolean, default: false },
  leaseContractNumber: String,
  leaseExpiryDate: String,
  place: String,
  companyEmail: String,
  companyMobile: String,

  // ICP Details
  icpEstablishmentCardNumber: String,
  eChannelUsername: String,
  eChannelPassword: String,
  establishmentCardIssueDate: String,
  establishmentCardExpiryDate: String,

  // Mohre Details
  mohreNumber: String,
  mohreUpdatingLastDate: String,

  // Daman Details
  damanPolicyNumber: String,
  damanExpiryDate: String,
  totalMembersInDaman: String,

  // General Contact Person
  contactPersonDetails: String,
  
  // Assigned staff for permissions
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
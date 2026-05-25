import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true }, // Auto-generated (EMP-001...)
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Linked Company
  name: String,
  designation: String,
  nationality: String,
  passportNo: String,
  passportExpiryDate: String,
  
  emiratesIdNo: String,
  emiratesIdIssueDate: String,
  emiratesIdExpiryDate: String,
  
  labourCardNo: String,
  labourCardExpiryDate: String,
  
  iloeExpiryDate: String,
  
  insurance: String, // Manual Entry
  insuranceExpiryDate: String,
  
  dateOfBirth: String,
  mobileNo: String,
  email: String
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
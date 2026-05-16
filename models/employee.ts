import mongoose, { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false }, // കമ്പനിയുമായി ലിങ്ക് ചെയ്യാൻ
  name: { type: String, required: true },
  designation: String,
  nationality: String,
  passportNo: String,
  passportExpiry: String,
  emiratesIdNo: String,
  emiratesIdIssue: String,
  emiratesIdExpiry: String,
  labourCardNo: String,
  labourCardExpiry: String,
  visaExpiry: String, // വിസ എക്സ്പൈറി ഡേറ്റ് ട്രാക്കർ
  iloeExpiry: String,
  insuranceCompany: String,
  insuranceExpiry: String,
  dob: String,
  mobile: String,
  email: String
}, { timestamps: true });

export default models.Employee || model('Employee', EmployeeSchema);
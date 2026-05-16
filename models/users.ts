import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  email: String,
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'manager' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: true });

export default models.user || model('user', userSchema);
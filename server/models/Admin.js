import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Lily Admin' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

adminSchema.methods.comparePassword = function(password) { return bcrypt.compare(password, this.passwordHash); };
adminSchema.statics.hashPassword = function(password) { return bcrypt.hash(password, 12); };

export default mongoose.model('Admin', adminSchema);

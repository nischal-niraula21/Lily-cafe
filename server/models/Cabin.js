import mongoose from 'mongoose';

const cabinSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, enum: ['C1','C2','C3','C4','C5'] },
  capacity: { type: String, required: true, trim: true },
  features: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  availability: { type: String, enum: ['available','unavailable'], default: 'available', index: true },
}, { timestamps: true });

export default mongoose.model('Cabin', cabinSchema);

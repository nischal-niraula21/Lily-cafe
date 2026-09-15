import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  sortOrder: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '', trim: true },
  sortOrder: { type: Number, default: 0, index: true },
  isActive: { type: Boolean, default: true },
  items: [itemSchema],
}, { timestamps: true });

export default mongoose.model('MenuCategory', categorySchema);

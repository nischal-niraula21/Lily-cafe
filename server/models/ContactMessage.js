import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);

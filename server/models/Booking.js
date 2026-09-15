import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  cabin: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabin', required: true, index: true },
  cabinSnapshot: {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1 },
  specialRequest: { type: String, default: '', trim: true, maxlength: 1000 },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  approvedAt: Date,
  rejectedAt: Date,
  confirmationEmailSentAt: Date,
}, { timestamps: true });

bookingSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model('Booking', bookingSchema);

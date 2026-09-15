import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true, unique: true },
  alt: { type: String, default: 'Lily Cafe gallery image', trim: true },
  sortOrder: { type: Number, default: 0, index: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('GalleryImage', galleryImageSchema);

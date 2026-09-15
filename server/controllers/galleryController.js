import GalleryImage from '../models/GalleryImage.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

function ensureCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw httpError(503, 'Cloudinary is not configured for Lily Cafe yet.');
  }
}

function uploadBuffer(buffer) {
  ensureCloudinary();
  return new Promise((resolve,reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: process.env.CLOUDINARY_FOLDER || 'lily-cafe/gallery',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }, (error,result) => error ? reject(error) : resolve(result));
    stream.end(buffer);
  });
}

export const getPublicGallery = asyncHandler(async (req,res) => {
  const images = await GalleryImage.find({ isActive:true }).sort({ sortOrder:1, createdAt:-1 }).lean();
  res.json({ images });
});

export const getAdminGallery = asyncHandler(async (req,res) => {
  const images = await GalleryImage.find().sort({ sortOrder:1, createdAt:-1 }).lean();
  res.json({ images });
});

export const uploadGalleryImage = asyncHandler(async (req,res) => {
  if (!req.file) throw httpError(400, 'Choose an image to upload.');
  const uploaded = await uploadBuffer(req.file.buffer);
  const image = await GalleryImage.create({
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    alt: req.body.alt || 'Lily Cafe gallery image',
    sortOrder: Number(req.body.sortOrder || 0),
    isActive: req.body.isActive !== 'false',
  });
  res.status(201).json({ message: 'Gallery image uploaded.', image });
});

export const updateGalleryImage = asyncHandler(async (req,res) => {
  const allowed = ['alt','sortOrder','isActive'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const image = await GalleryImage.findByIdAndUpdate(req.params.id, updates, { new:true, runValidators:true });
  if (!image) throw httpError(404, 'Gallery image not found.');
  res.json({ message: 'Gallery image updated.', image });
});

export const deleteGalleryImage = asyncHandler(async (req,res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) throw httpError(404, 'Gallery image not found.');
  ensureCloudinary();
  await cloudinary.uploader.destroy(image.publicId);
  await image.deleteOne();
  res.json({ message: 'Gallery image deleted.' });
});

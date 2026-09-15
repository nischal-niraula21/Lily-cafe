import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import GalleryImage from '../models/GalleryImage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photosDir = path.resolve(__dirname, '../../public/assets/photos');

const labels = {
  'terrace.webp': 'Lily Cafe terrace seating',
  'coffee-tray.webp': 'Coffee service at Lily',
  'chilli-platter.webp': 'A colorful savoury dish at Lily',
  'green-red-mocktails.webp': 'Two colorful mocktails at Lily',
  'family-celebration.webp': 'Guests celebrating at Lily',
  'pool-room.webp': 'Pool tables at Lily',
  'shakes.webp': 'Two chilled drinks at Lily',
  'hallway.webp': 'Interior hallway at Lily',
  'fried-bites.webp': 'Crispy bites served at Lily',
  'spicy-ribs.webp': 'Spicy plated dish at Lily',
  'latte-glass.webp': 'Layered coffee at Lily',
  'fried-cutlets.webp': 'Crispy cutlets at Lily',
  'blue-orange-mocktail.webp': 'Blue and orange mocktail at Lily',
  'mason-mocktails.webp': 'Mason jar mocktails at Lily',
  'large-gathering.webp': 'Large gathering at Lily Cafe',
};

try {
  await connectDB();
  if (await GalleryImage.countDocuments() > 0) {
    console.log('Gallery already has database images; skipped migration.');
  } else {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) throw new Error('Configure Lily Cloudinary credentials first.');
    const files = Object.keys(labels).filter(name => fs.existsSync(path.join(photosDir, name)));
    for (let i = 0; i < files.length; i++) {
      const name = files[i];
      const result = await cloudinary.uploader.upload(path.join(photosDir, name), { folder: process.env.CLOUDINARY_FOLDER || 'lily-cafe/gallery', resource_type: 'image' });
      await GalleryImage.create({ url: result.secure_url, publicId: result.public_id, alt: labels[name], sortOrder: i + 1, isActive: true });
      console.log(`Uploaded ${name}`);
    }
    console.log('Current Lily gallery migrated to Cloudinary and MongoDB.');
  }
} catch (error) { console.error(error); process.exitCode = 1; } finally { await mongoose.disconnect(); }

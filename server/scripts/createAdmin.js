import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';

try {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the root .env first.');
  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.findOneAndUpdate({ email }, { email, passwordHash, name: 'Lily Admin', isActive: true }, { new: true, upsert: true, setDefaultsOnInsert: true });
  console.log(`Admin ready: ${admin.email}`);
} catch (error) { console.error(error); process.exitCode = 1; } finally { await mongoose.disconnect(); }

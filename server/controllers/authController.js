import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

const signToken = (admin) => jwt.sign({ sub: admin._id.toString(), role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const login = asyncHandler(async (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email and password are required.');
  const admin = await Admin.findOne({ email: email.toLowerCase().trim(), isActive: true });
  if (!admin || !(await admin.comparePassword(password))) throw httpError(401, 'Invalid email or password.');
  res.json({ token: signToken(admin), admin: { id: admin._id, email: admin.email, name: admin.name } });
});

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw httpError(401, 'Admin authentication required.');
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); } catch { throw httpError(401, 'Invalid or expired admin session.'); }
  const admin = await Admin.findById(decoded.sub).select('-passwordHash');
  if (!admin || !admin.isActive) throw httpError(401, 'Admin account is unavailable.');
  req.admin = admin;
  next();
});

import Cabin from '../models/Cabin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const getCabins = asyncHandler(async (req,res) => {
  const cabins = await Cabin.find().sort({ code: 1 }).lean();
  res.json({ cabins });
});

export const updateAvailability = asyncHandler(async (req,res) => {
  const { availability } = req.body;
  if (!['available','unavailable'].includes(availability)) throw httpError(400, 'Availability must be available or unavailable.');
  const cabin = await Cabin.findByIdAndUpdate(req.params.id, { availability }, { new: true, runValidators: true });
  if (!cabin) throw httpError(404, 'Cabin not found.');
  res.json({ message: `${cabin.code} is now ${availability}.`, cabin });
});

export const updateCabin = asyncHandler(async (req,res) => {
  const allowed = ['capacity','features','description','imageUrl'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const cabin = await Cabin.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!cabin) throw httpError(404, 'Cabin not found.');
  res.json({ message: 'Cabin updated.', cabin });
});

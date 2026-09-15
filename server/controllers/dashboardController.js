import Booking from '../models/Booking.js';
import Cabin from '../models/Cabin.js';
import GalleryImage from '../models/GalleryImage.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req,res) => {
  const [pendingBookings, approvedBookings, availableCabins, galleryImages, recentBookings] = await Promise.all([
    Booking.countDocuments({ status:'pending' }),
    Booking.countDocuments({ status:'approved' }),
    Cabin.countDocuments({ availability:'available' }),
    GalleryImage.countDocuments({ isActive:true }),
    Booking.find().populate('cabin').sort({ createdAt:-1 }).limit(6).lean(),
  ]);
  res.json({ pendingBookings, approvedBookings, availableCabins, galleryImages, recentBookings });
});

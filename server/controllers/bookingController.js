import Booking from '../models/Booking.js';
import Cabin from '../models/Cabin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
import { sendBookingApprovedEmail } from '../services/emailService.js';
import {
  getTodayInTimeZone,
  isValidDateString,
  isValidTimeString,
} from '../utils/dateTime.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value) {
  return String(value ?? '').trim();
}

function normalizeBookingPayload(body = {}) {
  return {
    fullName: cleanString(body.fullName),
    email: cleanString(body.email).toLowerCase(),
    phone: cleanString(body.phone),
    cabinCode: cleanString(body.cabinCode).toUpperCase(),
    date: cleanString(body.date),
    time: cleanString(body.time),
    guests: Number(body.guests),
    specialRequest: cleanString(body.specialRequest),
  };
}

function validateBookingInput(data) {
  const required = ['fullName', 'email', 'phone', 'cabinCode', 'date', 'time'];
  if (required.some((field) => !data[field]) || !data.guests) {
    throw httpError(400, 'Please complete all required booking fields.');
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    throw httpError(400, 'Please enter a valid email address.');
  }

  if (!isValidDateString(data.date)) {
    throw httpError(400, 'Please select a valid booking date.');
  }

  if (data.date < getTodayInTimeZone()) {
    throw httpError(400, 'Booking date cannot be in the past.');
  }

  if (!isValidTimeString(data.time)) {
    throw httpError(400, 'Please select a valid booking time.');
  }

  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 50) {
    throw httpError(400, 'Guest count must be between 1 and 50.');
  }

  if (data.fullName.length > 120 || data.phone.length > 40) {
    throw httpError(400, 'Please check the name and phone number.');
  }

  if (data.specialRequest.length > 1000) {
    throw httpError(400, 'Special request must be 1000 characters or fewer.');
  }
}

export const createBooking = asyncHandler(async (req, res) => {
  const data = normalizeBookingPayload(req.body);
  validateBookingInput(data);

  const cabin = await Cabin.findOne({ code: data.cabinCode });
  if (!cabin) throw httpError(404, 'Selected cabin was not found.');
  if (cabin.availability !== 'available') {
    throw httpError(409, `${cabin.code} is currently unavailable.`);
  }

  const booking = await Booking.create({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    cabin: cabin._id,
    cabinSnapshot: { code: cabin.code, name: cabin.name },
    date: data.date,
    time: data.time,
    guests: data.guests,
    specialRequest: data.specialRequest,
  });

  res.status(201).json({
    message: 'Booking request sent. Lily will confirm it after admin approval.',
    booking: { id: booking._id, status: booking.status },
  });
});

export const listBookings = asyncHandler(async (req, res) => {
  const query = req.query.status ? { status: req.query.status } : {};
  const bookings = await Booking.find(query)
    .populate('cabin')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ bookings });
});

export const setBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw httpError(400, 'Status must be approved or rejected.');
  }

  const booking = await Booking.findById(req.params.id).populate('cabin');
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'pending') {
    throw httpError(400, `This booking is already ${booking.status}.`);
  }

  if (status === 'rejected') {
    booking.status = 'rejected';
    booking.rejectedAt = new Date();
    await booking.save();
    return res.json({
      message: 'Booking rejected. Cabin availability was not changed.',
      booking,
    });
  }

  const cabin = await Cabin.findOneAndUpdate(
    { _id: booking.cabin._id, availability: 'available' },
    { $set: { availability: 'unavailable' } },
    { new: true }
  );

  if (!cabin) {
    throw httpError(
      409,
      `${booking.cabinSnapshot.code} is already unavailable. Make the cabin available first or approve a different request.`
    );
  }

  try {
    booking.status = 'approved';
    booking.approvedAt = new Date();
    await booking.save();
  } catch (error) {
    await Cabin.findByIdAndUpdate(booking.cabin._id, { availability: 'available' });
    throw error;
  }

  let emailSent = false;
  try {
    const result = await sendBookingApprovedEmail(booking);
    emailSent = Boolean(result.sent);
    if (emailSent) {
      booking.confirmationEmailSentAt = new Date();
      await booking.save();
    }
  } catch (error) {
    console.error('Booking email failed:', error);
  }

  return res.json({
    message: `${booking.cabinSnapshot.code} booking approved. Only this cabin is now unavailable.`,
    booking,
    cabin,
    emailSent,
  });
});

export const resendConfirmation = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('cabin');
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'approved') {
    throw httpError(400, 'Only approved bookings can receive a confirmation email.');
  }

  const result = await sendBookingApprovedEmail(booking);
  if (!result.sent) throw httpError(503, 'Resend is not configured.');

  booking.confirmationEmailSentAt = new Date();
  await booking.save();

  res.json({ message: 'Booking confirmation email sent again.' });
});

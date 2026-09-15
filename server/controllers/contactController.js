import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
import { sendContactNotification } from '../services/emailService.js';

export const submitContact = asyncHandler(async (req,res) => {
  const { fullName, contact, subject, message } = req.body;
  if (!fullName || !contact || !subject || !message) throw httpError(400, 'Please complete all contact fields.');
  const saved = await ContactMessage.create({ fullName, contact, subject, message });
  try { await sendContactNotification(saved); } catch (error) { console.error('Contact notification failed:', error); }
  res.status(201).json({ message: 'Your message has been sent to Lily Cafe.' });
});

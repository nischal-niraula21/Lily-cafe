import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { sendContactNotification } from "../services/emailService.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return String(value ?? "").trim();
}

export const submitContact = asyncHandler(async (req, res) => {
  const fullName = clean(req.body.fullName);
  const contact = clean(req.body.contact).toLowerCase();
  const subject = clean(req.body.subject);
  const message = clean(req.body.message);

  if (!fullName || !contact || !subject || !message) {
    throw httpError(400, "Please complete all contact fields.");
  }

  if (!EMAIL_PATTERN.test(contact)) {
    throw httpError(400, "Please enter a valid email address.");
  }

  if (fullName.length > 120 || subject.length > 160 || message.length > 3000) {
    throw httpError(400, "Please shorten the contact form details and try again.");
  }

  const saved = await ContactMessage.create({
    fullName,
    contact,
    subject,
    message,
  });

  const notification = await sendContactNotification(saved);
  if (!notification.sent) {
    throw httpError(503, "Your message was saved, but email delivery is not configured yet.");
  }

  res.status(201).json({
    message: "Your message has been sent to Lily Cafe.",
  });
});

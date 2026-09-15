import { Resend } from 'resend';
import { formatDateLong, formatTime12Hour } from '../utils/dateTime.js';

const esc = (value='') => String(value).replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendBookingApprovedEmail(booking) {
  const resend = getResend();
  if (!resend || !process.env.EMAIL_FROM) return { sent: false, skipped: true, reason: 'Resend is not configured.' };
  const logo = process.env.BRAND_LOGO_URL;
  const cabinCode = booking.cabinSnapshot?.code || booking.cabin?.code || '';
  const html = `
  <div style="margin:0;background:#0b0908;padding:32px 16px;font-family:Arial,sans-serif;color:#f4ead9">
    <div style="max-width:640px;margin:auto;background:#15110e;border:1px solid #3d3022;border-radius:18px;overflow:hidden">
      <div style="padding:28px 28px 22px;text-align:center;border-bottom:1px solid #2d241b">
        ${logo ? `<img src="${esc(logo)}" alt="Lily Cafe & Restaurant" style="width:74px;height:74px;border-radius:50%;object-fit:cover;margin-bottom:12px">` : ''}
        <div style="font-family:Georgia,serif;font-size:32px;color:#fff">Lily</div>
        <div style="font-size:10px;letter-spacing:4px;color:#d9ad5f;margin-top:3px">CAFE &amp; RESTAURANT</div>
      </div>
      <div style="padding:30px">
        <div style="font-size:12px;letter-spacing:2px;color:#d9ad5f;text-transform:uppercase">Booking Successful</div>
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:34px;margin:10px 0 12px;color:#fff">Your cabin is confirmed.</h1>
        <p style="line-height:1.7;color:#c9bcae">Hi ${esc(booking.fullName)}, your booking at Lily Cafe &amp; Restaurant has been approved. We look forward to welcoming you.</p>
        <div style="margin:24px 0;background:#0f0d0b;border-radius:14px;padding:18px">
          <table style="width:100%;border-collapse:collapse;color:#f4ead9;font-size:14px">
            <tr><td style="padding:8px;color:#918174">Cabin</td><td style="padding:8px;text-align:right;font-weight:bold">Cabin ${esc(cabinCode)}</td></tr>
            <tr><td style="padding:8px;color:#918174">Date</td><td style="padding:8px;text-align:right">${esc(formatDateLong(booking.date))}</td></tr>
            <tr><td style="padding:8px;color:#918174">Time</td><td style="padding:8px;text-align:right">${esc(formatTime12Hour(booking.time))}</td></tr>
            <tr><td style="padding:8px;color:#918174">Guests</td><td style="padding:8px;text-align:right">${esc(booking.guests)}</td></tr>
            <tr><td style="padding:8px;color:#918174">Name</td><td style="padding:8px;text-align:right">${esc(booking.fullName)}</td></tr>
            <tr><td style="padding:8px;color:#918174">Phone</td><td style="padding:8px;text-align:right">${esc(booking.phone)}</td></tr>
            ${booking.specialRequest ? `<tr><td style="padding:8px;color:#918174;vertical-align:top">Request</td><td style="padding:8px;text-align:right">${esc(booking.specialRequest)}</td></tr>` : ''}
          </table>
        </div>
        <p style="font-size:13px;color:#8e8176;line-height:1.6">Lily Cafe &amp; Restaurant<br>Chandragadhi, Jhapa, Nepal</p>
      </div>
    </div>
  </div>`;
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject: `Booking Successful - ${cabinCode} at Lily Cafe & Restaurant`,
    html,
  });
  if (result?.error) throw new Error(result.error.message || 'Resend could not send the booking email.');
  return { sent: true, result };
}

export async function sendContactNotification(message) {
  const resend = getResend();
  const to = process.env.CONTACT_TO_EMAIL || "nischalniraula44@gmail.com";

  if (!resend || !process.env.EMAIL_FROM) {
    return {
      sent: false,
      skipped: true,
      reason: "Resend is not configured.",
    };
  }

  const logo = process.env.BRAND_LOGO_URL;
  const html = `
  <div style="margin:0;background:#0b0908;padding:28px 16px;font-family:Arial,sans-serif;color:#f4ead9">
    <div style="max-width:640px;margin:auto;background:#15110e;border:1px solid #3d3022;border-radius:18px;overflow:hidden">
      <div style="padding:24px 28px;text-align:center;border-bottom:1px solid #2d241b">
        ${logo ? `<img src="${esc(logo)}" alt="Lily Cafe & Restaurant" style="width:68px;height:68px;border-radius:50%;object-fit:cover;margin-bottom:10px">` : ""}
        <div style="font-family:Georgia,serif;font-size:30px;color:#fff">Lily</div>
        <div style="font-size:10px;letter-spacing:4px;color:#d9ad5f;margin-top:3px">CAFE &amp; RESTAURANT</div>
      </div>
      <div style="padding:28px">
        <div style="font-size:12px;letter-spacing:2px;color:#d9ad5f;text-transform:uppercase">Website Message</div>
        <h2 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;margin:10px 0 22px;color:#fff">${esc(message.subject)}</h2>
        <table style="width:100%;border-collapse:collapse;color:#f4ead9;font-size:14px">
          <tr><td style="padding:8px;color:#918174;width:110px">Name</td><td style="padding:8px">${esc(message.fullName)}</td></tr>
          <tr><td style="padding:8px;color:#918174">Email</td><td style="padding:8px">${esc(message.contact)}</td></tr>
        </table>
        <div style="margin-top:18px;padding:18px;background:#0f0d0b;border-radius:14px;line-height:1.7;color:#d8ccc1">${esc(message.message).replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>`;

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    replyTo: message.contact,
    subject: `Lily contact: ${message.subject}`,
    html,
  });

  if (result?.error) {
    throw new Error(result.error.message || "Resend could not send the contact email.");
  }

  return { sent: true, result };
}

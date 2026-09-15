# Lily Cafe & Restaurant - Full Stack V3

This build keeps the approved Lily frontend design while cleaning the full-stack integration and booking workflow.

## What changed in V3

- Fixed the local frontend/API setup to use the Vite `/api` proxy during development.
- Development CORS now accepts localhost/127.0.0.1 safely while production remains restricted to configured origins.
- `npm run dev` now stops both processes if the backend crashes, so the frontend cannot silently keep running with fallback data.
- Nodemon watches only the `server/` folder instead of restarting for frontend edits.
- Cabin cards now show **Booking Offline** if the API cannot be reached instead of letting a user submit a request that cannot work.
- Cabin booking now uses a custom calendar date picker.
- Cabin booking now uses a small analog clock for hour selection, a minute selector, and an AM/PM dropdown.
- Admin login now includes a show/hide password eye toggle.
- Dynamic reveal animations now observe API-loaded content correctly.
- Admin bookings, cabins, menu and gallery code was cleaned and made easier to maintain.
- Admin menu can now show/hide categories and individual menu items.
- Admin gallery can update alt text, sort order and visibility in addition to upload/delete.
- Admin booking dates/times are displayed in readable formats.
- Added `npm run check:env` to catch malformed or duplicated `.env` lines without printing secrets.

## Project structure

```text
Lily-Cafe-FullStack-v3/
├── src/                    # React frontend
│   ├── components/
│   │   ├── admin/
│   │   └── booking/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/                 # Lily logo and approved photos
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
├── .env.example
├── package.json
└── vite.config.js
```

## Important: keep your existing `.env` values

The downloadable project intentionally does **not** include your `.env` secrets.

Copy your current `.env` into the new project root, then compare it with `.env.example`. Every setting must be on one line in this form:

```env
NAME=value
```

Do not leave duplicate keys or standalone secret/URL lines.

Run this after copying your `.env`:

```powershell
npm run check:env
```

The command checks structure only and does not print your secret values.

Recommended local values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
VITE_API_URL=http://localhost:5000/api
VITE_DEV_API_TARGET=http://localhost:5000
APP_TIME_ZONE=Asia/Kathmandu
DNS_SERVERS=8.8.8.8,1.1.1.1
```

Keep your own Lily MongoDB, JWT, Cloudinary, Resend and logo values below those settings.

## Install and run

From the project root:

```powershell
npm install
npm run check:env
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

Admin login:

```text
http://localhost:5173/admin/login
```

## Initial database setup

Only run these when required:

```powershell
npm run seed
npm run seed:admin
npm run seed:gallery
```

- `seed` creates/keeps C1-C5 and the starter menu.
- `seed:admin` creates/updates the admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- `seed:gallery` migrates the built-in Lily gallery into the separate Lily Cloudinary account if the gallery database is empty.

## Booking behavior

1. Customer selects one available cabin from C1-C5.
2. Customer chooses a date from the calendar.
3. Customer chooses the hour from the analog clock, minute from the dropdown and AM/PM from the dropdown.
4. Request is stored as `pending` and appears in Admin > Bookings.
5. Admin approval changes **only the requested cabin** to `unavailable`.
6. C1, C2, C3, C4 and C5 remain independent.
7. Admin can later mark that exact cabin `available` again.
8. Approval attempts the branded Resend confirmation email.

## Resend development note

When using `onboarding@resend.dev`, test booking confirmations with the email address allowed by your Resend test account. A verified sending domain will be needed later for unrestricted customer delivery.

## Production note

For production, set:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.example
VITE_API_URL=https://your-backend-domain.example/api
```

Do not commit `.env` to Git.

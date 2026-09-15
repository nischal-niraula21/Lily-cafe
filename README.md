# Lily Cafe & Restaurant

A modern full-stack website for **Lily Cafe & Restaurant**, located in **Chandragadhi, Jhapa, Nepal**.

The project provides customers with an elegant restaurant experience while also giving the restaurant admin tools to manage cabin bookings, menu items, gallery images, and cabin availability without editing code.

---

## Features

### Customer Website

- Modern responsive restaurant website
- Dark luxury UI/UX
- Interactive digital menu book
- Private cabin booking system
- Cabins C1–C5
- Live cabin availability
- Booking request form
- Custom calendar date picker
- Analog-style time picker
- AM/PM time selection
- Restaurant gallery
- Image lightbox with next/previous navigation
- About and Why Us sections
- Contact form
- Google Maps restaurant location
- Mobile, tablet, and desktop responsive design

---

## Cabin Booking System

Customers can select one of the available cabins:

- C1
- C2
- C3
- C4
- C5

A booking request contains information such as:

- Customer name
- Email
- Phone number
- Selected cabin
- Date
- Time
- Number of guests
- Special request

New bookings are initially stored as:

```text
Pending
The admin can then approve or reject the request.
When a booking is approved, only the selected cabin becomes unavailable.
For example:
C1 - Available
C2 - Available
C3 - Unavailable
C4 - Available
C5 - Available
The admin can later manually make that cabin available again.
Booking Confirmation Email
When the admin approves a booking, the customer receives a branded Booking Successful email.
The email contains:
- Lily Cafe & Restaurant branding
- Lily logo
- Customer name
- Cabin number and name
- Booking date
- Booking time
- Number of guests
- Phone number
- Special request
Emails are handled using Resend.
Admin Console
The secure admin dashboard allows the restaurant to manage the website without directly editing the code.
Booking Management
Admin can:
- View booking requests
- Approve bookings
- Reject bookings
- View booking details
- Manage booking status
- Send booking confirmation emails
Cabin Management
Admin can:
- View C1–C5
- See current availability
- Mark individual cabins available
- Mark individual cabins unavailable
Each cabin is managed independently.
Menu Management
Admin can:
- Add menu categories
- Edit menu categories
- Hide/show categories
- Add menu items
- Edit menu items
- Update prices
- Update descriptions
- Hide/show items
- Delete menu items
Changes automatically appear on the public digital menu.
Gallery Management
Admin can:
- Upload gallery images
- Delete gallery images
- Change image order
- Edit image alt text
- Hide/show gallery images
Gallery images are stored using Cloudinary.
Technology Stack
Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
Backend
- Node.js
- Express.js
- REST API
Database
- MongoDB Atlas
- Mongoose
Authentication
- JSON Web Token (JWT)
- bcrypt
Media Storage
- Cloudinary
Email
- Resend
Project Structure
Lily cafe/
│
├── public/
│   └── assets/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── admin/
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
Environment Variables
Create a .env file in the project root.
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=
ADMIN_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=lily-cafe/gallery

RESEND_API_KEY=
EMAIL_FROM=
CONTACT_TO_EMAIL=
BRAND_LOGO_URL=
Never commit the real .env file to GitHub.

Use .env.example for placeholder environment variables.
Installation
Clone the repository:
git clone YOUR_REPOSITORY_URL
Open the project:
cd "Lily cafe"
Install dependencies:
npm install
Database Setup
Seed the initial cabin and menu data:
npm run seed
Create the admin account:
npm run seed:admin
Upload the initial gallery images to Cloudinary:
npm run seed:gallery
Run the Project
Start the frontend and backend together:
npm run dev
Frontend:
http://localhost:5173
Backend:
http://localhost:5000
API health check:
http://localhost:5000/api/health
Admin Authentication
Admin credentials are configured through:
ADMIN_EMAIL=
ADMIN_PASSWORD=
The password is hashed using bcrypt before being stored in MongoDB.
Admin authentication uses JWT.
Restaurant Location
Lily Cafe & Restaurant
Chandragadhi, Jhapa, Nepal
Google Maps location is integrated into the Contact page.
Image Storage
Restaurant gallery images are stored separately in Cloudinary under:
lily-cafe/
└── gallery/
Brand assets such as the Lily logo can be stored under:
lily-cafe/
└── branding/
Security
Sensitive information such as:
- MongoDB credentials
- JWT secrets
- Cloudinary API secret
- Resend API key
- Admin credentials
must remain inside .env and must never be committed to GitHub.
Deployment
The project can be deployed without a custom domain.
Example setup:
Frontend  -> Vercel / Cloudflare Pages
Backend   -> Render
Database  -> MongoDB Atlas
Images    -> Cloudinary
Email     -> Resend
A custom domain can be connected later without rebuilding the project.
Future Improvements
Possible future additions include:
- Real-time date/time-slot availability
- Automatic cabin availability after booking completion
- Booking history
- Admin analytics
- Customer cancellation requests
- WhatsApp booking notifications
- Online payments
- Custom restaurant domain
- Production email domain
Copyright
© 2026 Lily Cafe & Restaurant. All rights reserved.
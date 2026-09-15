import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, Home, Images } from 'lucide-react';
import { api, getErrorMessage } from '../../api/client';
import AdminAlert from '../../components/admin/AdminAlert';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { formatDateDisplay, formatTime12Hour } from '../../utils/dateTime';

const initialData = {
  pendingBookings: 0,
  approvedBookings: 0,
  availableCabins: 0,
  galleryImages: 0,
  recentBookings: [],
};

export default function AdminDashboard() {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((response) => setData(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, []);

  const cards = [
    ['Pending bookings', data.pendingBookings, CalendarClock],
    ['Approved bookings', data.approvedBookings, CheckCircle2],
    ['Available cabins', data.availableCabins, Home],
    ['Gallery images', data.galleryImages, Images],
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Bookings, cabin availability and content at a glance."
      />

      <AdminAlert error={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-[#15110e] p-5"
          >
            <Icon size={20} className="mb-5 text-[#d9ad5f]" />
            <div className="text-3xl font-semibold">{value}</div>
            <div className="mt-1 text-sm text-stone-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#15110e]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-serif text-2xl">Recent bookings</h2>
        </div>

        <div className="divide-y divide-white/5">
          {data.recentBookings?.length ? (
            data.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="grid gap-2 px-5 py-4 sm:grid-cols-4"
              >
                <div>
                  <div className="font-medium">{booking.fullName}</div>
                  <div className="text-xs text-stone-500">{booking.email}</div>
                </div>

                <div className="text-sm text-stone-300">
                  Cabin {booking.cabinSnapshot?.code || booking.cabin?.code}
                </div>

                <div className="text-sm text-stone-400">
                  {formatDateDisplay(booking.date) || booking.date} at{' '}
                  {formatTime12Hour(booking.time) || booking.time}
                </div>

                <div className="text-sm capitalize text-[#d9ad5f]">
                  {booking.status}
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 text-sm text-stone-500">No bookings yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

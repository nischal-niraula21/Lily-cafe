import { useCallback, useEffect, useState } from 'react';
import { Check, Mail, RefreshCcw, X } from 'lucide-react';
import { api, getErrorMessage } from '../../api/client';
import AdminAlert from '../../components/admin/AdminAlert';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { formatDateDisplay, formatTime12Hour } from '../../utils/dateTime';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

function statusClasses(status) {
  if (status === 'approved') return 'bg-emerald-500/15 text-emerald-300';
  if (status === 'rejected') return 'bg-red-500/15 text-red-300';
  return 'bg-amber-500/15 text-amber-300';
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState('');
  const [state, setState] = useState({
    loading: true,
    error: '',
    message: '',
  });

  const loadBookings = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: '' }));

    try {
      const { data } = await api.get('/admin/bookings', {
        params: filter === 'all' ? {} : { status: filter },
      });
      setBookings(data.bookings || []);
      setState((previous) => ({ ...previous, loading: false }));
    } catch (error) {
      setState({
        loading: false,
        error: getErrorMessage(error),
        message: '',
      });
    }
  }, [filter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const setBookingStatus = async (id, status) => {
    setBusyId(id);
    setState((previous) => ({ ...previous, error: '', message: '' }));

    try {
      const { data } = await api.patch(`/admin/bookings/${id}/status`, {
        status,
      });

      const message =
        status === 'approved' && data.emailSent === false
          ? 'Booking approved, but the confirmation email was not sent. Check the Resend settings.'
          : data.message;

      setState((previous) => ({ ...previous, message, error: '' }));
      await loadBookings();
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(error),
        message: '',
      }));
    } finally {
      setBusyId('');
    }
  };

  const resendConfirmation = async (id) => {
    setBusyId(id);
    setState((previous) => ({ ...previous, error: '', message: '' }));

    try {
      const { data } = await api.post(
        `/admin/bookings/${id}/resend-confirmation`
      );
      setState((previous) => ({
        ...previous,
        message: data.message,
        error: '',
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(error),
        message: '',
      }));
    } finally {
      setBusyId('');
    }
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Reservations"
        title="Bookings"
        description="Approving a request makes only that requested cabin unavailable."
        action={
          <button
            type="button"
            onClick={loadBookings}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-stone-300 transition hover:bg-white/5"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm capitalize transition ${
              filter === item
                ? 'bg-[#d9ad5f] text-black'
                : 'border border-white/10 text-stone-400 hover:bg-white/5'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <AdminAlert error={state.error} message={state.message} />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15110e]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Cabin</th>
                <th className="px-4 py-3">Date / time</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => {
                const isBusy = busyId === booking._id;
                return (
                  <tr key={booking._id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium text-white">
                        {booking.fullName}
                      </div>
                      <div className="mt-1 text-xs text-stone-500">
                        {booking.email}
                        <br />
                        {booking.phone}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      Cabin {booking.cabinSnapshot?.code || booking.cabin?.code}
                    </td>

                    <td className="px-4 py-4">
                      {formatDateDisplay(booking.date) || booking.date}
                      <div className="text-xs text-stone-500">
                        {formatTime12Hour(booking.time) || booking.time}
                      </div>
                    </td>

                    <td className="px-4 py-4">{booking.guests}</td>
                    <td className="max-w-xs px-4 py-4 text-stone-400">
                      {booking.specialRequest || '-'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              title="Approve"
                              aria-label="Approve booking"
                              disabled={isBusy}
                              onClick={() =>
                                setBookingStatus(booking._id, 'approved')
                              }
                              className="rounded-lg bg-emerald-500/15 p-2 text-emerald-300 disabled:opacity-40"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              title="Reject"
                              aria-label="Reject booking"
                              disabled={isBusy}
                              onClick={() =>
                                setBookingStatus(booking._id, 'rejected')
                              }
                              className="rounded-lg bg-red-500/15 p-2 text-red-300 disabled:opacity-40"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {booking.status === 'approved' && (
                          <button
                            type="button"
                            title="Resend confirmation"
                            aria-label="Resend confirmation email"
                            disabled={isBusy}
                            onClick={() => resendConfirmation(booking._id)}
                            className="rounded-lg bg-white/5 p-2 text-stone-300 disabled:opacity-40"
                          >
                            <Mail size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!bookings.length && !state.loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-stone-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}

              {state.loading && !bookings.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-stone-500"
                  >
                    Loading bookings...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

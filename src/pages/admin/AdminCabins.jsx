import { useCallback, useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../api/client';
import AdminAlert from '../../components/admin/AdminAlert';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function AdminCabins() {
  const [cabins, setCabins] = useState([]);
  const [busyId, setBusyId] = useState('');
  const [state, setState] = useState({
    loading: true,
    error: '',
    message: '',
  });

  const loadCabins = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: '' }));

    try {
      const { data } = await api.get('/admin/cabins');
      setCabins(data.cabins || []);
      setState((previous) => ({ ...previous, loading: false }));
    } catch (error) {
      setState({
        loading: false,
        error: getErrorMessage(error),
        message: '',
      });
    }
  }, []);

  useEffect(() => {
    loadCabins();
  }, [loadCabins]);

  const setAvailability = async (cabin, availability) => {
    setBusyId(cabin._id);
    setState((previous) => ({ ...previous, error: '', message: '' }));

    try {
      const { data } = await api.patch(
        `/admin/cabins/${cabin._id}/availability`,
        { availability }
      );
      setState((previous) => ({
        ...previous,
        message: data.message,
        error: '',
      }));
      await loadCabins();
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
        eyebrow="C1 - C5"
        title="Cabins"
        description="Each cabin is independent. Changing one cabin never changes the other four."
      />

      <AdminAlert error={state.error} message={state.message} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cabins.map((cabin) => {
          const available = cabin.availability === 'available';
          return (
            <article
              key={cabin._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#15110e]"
            >
              <img
                src={cabin.imageUrl}
                alt={`Cabin ${cabin.code}`}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[.2em] text-[#d9ad5f]">
                      Cabin {cabin.code}
                    </div>
                    <h2 className="mt-1 font-serif text-2xl">{cabin.name}</h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs capitalize ${
                      available
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-red-500/15 text-red-300'
                    }`}
                  >
                    {cabin.availability}
                  </span>
                </div>

                <p className="mt-3 text-sm text-stone-500">
                  {cabin.capacity} · {cabin.bestFor}
                </p>

                <button
                  type="button"
                  disabled={busyId === cabin._id}
                  onClick={() =>
                    setAvailability(
                      cabin,
                      available ? 'unavailable' : 'available'
                    )
                  }
                  className="mt-5 w-full rounded-xl border border-[#d9ad5f]/40 px-4 py-2.5 text-sm text-[#d9ad5f] transition hover:bg-[#d9ad5f] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyId === cabin._id
                    ? 'Updating...'
                    : available
                      ? 'Make unavailable'
                      : 'Make available'}
                </button>
              </div>
            </article>
          );
        })}

        {!cabins.length && !state.loading && !state.error && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-10 text-center text-stone-500">
            No cabins found. Run <code>npm run seed</code> once.
          </div>
        )}
      </div>
    </div>
  );
}

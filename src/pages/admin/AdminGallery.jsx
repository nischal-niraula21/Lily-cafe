import { useCallback, useEffect, useState } from 'react';
import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { api, getErrorMessage } from '../../api/client';
import AdminAlert from '../../components/admin/AdminAlert';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState('');
  const [edits, setEdits] = useState({});
  const [busyId, setBusyId] = useState('');
  const [state, setState] = useState({
    loading: false,
    error: '',
    message: '',
  });

  const loadImages = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/gallery');
      const nextImages = data.images || [];
      setImages(nextImages);
      setEdits(
        Object.fromEntries(
          nextImages.map((image) => [
            image._id,
            {
              alt: image.alt || '',
              sortOrder: image.sortOrder || 0,
              isActive: image.isActive !== false,
            },
          ])
        )
      );
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;

    setState({ loading: true, error: '', message: '' });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt', alt.trim());
    formData.append('sortOrder', String(images.length + 1));

    try {
      await api.post('/admin/gallery', formData);
      setFile(null);
      setAlt('');
      event.currentTarget.reset();
      setState({ loading: false, error: '', message: 'Image uploaded.' });
      await loadImages();
    } catch (error) {
      setState({
        loading: false,
        error: getErrorMessage(error),
        message: '',
      });
    }
  };

  const updateImage = async (image) => {
    const payload = edits[image._id];
    if (!payload) return;

    setBusyId(image._id);
    setState((previous) => ({ ...previous, error: '', message: '' }));

    try {
      const { data } = await api.patch(`/admin/gallery/${image._id}`, {
        ...payload,
        sortOrder: Number(payload.sortOrder) || 0,
      });
      setState((previous) => ({
        ...previous,
        message: data.message || 'Image updated.',
        error: '',
      }));
      await loadImages();
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

  const removeImage = async (image) => {
    if (!window.confirm('Delete this gallery image?')) return;

    setBusyId(image._id);
    setState((previous) => ({ ...previous, error: '', message: '' }));

    try {
      const { data } = await api.delete(`/admin/gallery/${image._id}`);
      setState((previous) => ({
        ...previous,
        message: data.message || 'Image deleted.',
        error: '',
      }));
      await loadImages();
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

  const updateEdit = (id, field, value) => {
    setEdits((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Cloudinary"
        title="Gallery"
        description="Upload, order, hide or remove public gallery images without touching code."
      />

      <AdminAlert error={state.error} message={state.message} />

      <form
        onSubmit={upload}
        className="mb-8 grid gap-4 rounded-2xl border border-white/10 bg-[#15110e] p-5 md:grid-cols-[1fr_1fr_auto]"
      >
        <label className="rounded-xl border border-dashed border-white/15 bg-black/10 px-4 py-3 text-sm text-stone-400">
          <input
            required
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <input
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#d9ad5f]"
          placeholder="Image description / alt text"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
        />

        <button
          disabled={state.loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#d9ad5f] px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus size={18} />
          {state.loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => {
          const edit = edits[image._id] || {
            alt: image.alt || '',
            sortOrder: image.sortOrder || 0,
            isActive: image.isActive !== false,
          };
          const busy = busyId === image._id;

          return (
            <article
              key={image._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#15110e]"
            >
              <img
                src={image.url}
                alt={image.alt || 'Lily gallery'}
                className="h-56 w-full object-cover"
              />

              <div className="space-y-3 p-4">
                <input
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#d9ad5f]"
                  value={edit.alt}
                  aria-label="Image alt text"
                  onChange={(event) =>
                    updateEdit(image._id, 'alt', event.target.value)
                  }
                />

                <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#d9ad5f]"
                    value={edit.sortOrder}
                    aria-label="Image sort order"
                    onChange={(event) =>
                      updateEdit(image._id, 'sortOrder', event.target.value)
                    }
                  />

                  <label className="flex items-center gap-2 text-sm text-stone-400">
                    <input
                      type="checkbox"
                      checked={edit.isActive}
                      onChange={(event) =>
                        updateEdit(image._id, 'isActive', event.target.checked)
                      }
                    />
                    Visible
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => updateImage(image)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-stone-200 transition hover:bg-white/10 disabled:opacity-40"
                  >
                    <Save size={15} />
                    Save
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeImage(image)}
                    className="rounded-lg bg-red-500/10 p-2 text-red-300 disabled:opacity-40"
                    aria-label="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {!images.length && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-10 text-center text-stone-500">
            No Cloudinary gallery images yet. The public site will keep using
            its built-in fallback images until you upload some.
          </div>
        )}
      </div>
    </div>
  );
}

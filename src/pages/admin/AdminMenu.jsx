import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { api, getErrorMessage } from '../../api/client';
import AdminAlert from '../../components/admin/AdminAlert';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyCategory = {
  title: '',
  subtitle: '',
  sortOrder: 1,
  isActive: true,
};

const emptyItem = {
  name: '',
  price: '',
  sortOrder: 1,
  isAvailable: true,
};

export default function AdminMenu() {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [itemForms, setItemForms] = useState({});
  const [editing, setEditing] = useState(null);
  const [state, setState] = useState({ error: '', message: '' });

  const loadMenu = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/menu');
      setCategories(data.categories || []);
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const createCategory = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/menu/categories', categoryForm);
      setCategoryForm(emptyCategory);
      setState({ message: 'Category added.', error: '' });
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const updateCategory = async (category, payload) => {
    try {
      await api.patch(`/admin/menu/categories/${category._id}`, payload);
      setState({ message: 'Category updated.', error: '' });
      setEditing(null);
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete ${category.title} and all of its items?`)) return;

    try {
      await api.delete(`/admin/menu/categories/${category._id}`);
      setState({ message: 'Category deleted.', error: '' });
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const addItem = async (category, event) => {
    event.preventDefault();
    const form = itemForms[category._id] || emptyItem;

    try {
      await api.post(`/admin/menu/categories/${category._id}/items`, form);
      setItemForms((previous) => ({
        ...previous,
        [category._id]: emptyItem,
      }));
      setState({ message: 'Menu item added.', error: '' });
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const updateItem = async (category, item, payload) => {
    try {
      await api.patch(
        `/admin/menu/categories/${category._id}/items/${item._id}`,
        payload
      );
      setState({ message: 'Menu item updated.', error: '' });
      setEditing(null);
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const deleteItem = async (category, item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;

    try {
      await api.delete(
        `/admin/menu/categories/${category._id}/items/${item._id}`
      );
      setState({ message: 'Menu item deleted.', error: '' });
      await loadMenu();
    } catch (error) {
      setState({ error: getErrorMessage(error), message: '' });
    }
  };

  const setItemForm = (categoryId, field, value) => {
    setItemForms((previous) => ({
      ...previous,
      [categoryId]: {
        ...(previous[categoryId] || emptyItem),
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content management"
        title="Menu"
        description="Edit the live menu without changing frontend code."
      />

      <AdminAlert error={state.error} message={state.message} />

      <form
        onSubmit={createCategory}
        className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-[#15110e] p-5 md:grid-cols-[1fr_1fr_120px_auto]"
      >
        <input
          required
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#d9ad5f]"
          placeholder="Category title"
          value={categoryForm.title}
          onChange={(event) =>
            setCategoryForm((previous) => ({
              ...previous,
              title: event.target.value,
            }))
          }
        />

        <input
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#d9ad5f]"
          placeholder="Subtitle"
          value={categoryForm.subtitle}
          onChange={(event) =>
            setCategoryForm((previous) => ({
              ...previous,
              subtitle: event.target.value,
            }))
          }
        />

        <input
          type="number"
          min="0"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#d9ad5f]"
          value={categoryForm.sortOrder}
          onChange={(event) =>
            setCategoryForm((previous) => ({
              ...previous,
              sortOrder: Number(event.target.value),
            }))
          }
        />

        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#d9ad5f] px-4 py-3 font-semibold text-black">
          <Plus size={17} />
          Add category
        </button>
      </form>

      <div className="space-y-5">
        {categories.map((category) => {
          const itemForm = itemForms[category._id] || emptyItem;

          return (
            <section
              key={category._id}
              className="rounded-2xl border border-white/10 bg-[#15110e]"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[.2em] text-[#d9ad5f]">
                    Section {category.sortOrder}
                    {!category.isActive && ' · Hidden'}
                  </div>
                  <h2 className="font-serif text-2xl">{category.title}</h2>
                  <p className="text-sm text-stone-500">{category.subtitle}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({ type: 'category', category })
                    }
                    className="rounded-lg bg-white/5 p-2 text-stone-300"
                    aria-label={`Edit ${category.title}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-lg bg-red-500/10 p-2 text-red-300"
                    aria-label={`Delete ${category.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editing?.type === 'category' &&
                editing.category._id === category._id && (
                  <EditCategory
                    category={category}
                    onCancel={() => setEditing(null)}
                    onSave={(payload) => updateCategory(category, payload)}
                  />
                )}

              <div className="divide-y divide-white/5">
                {(category.items || []).map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-stone-500">
                        Order {item.sortOrder} ·{' '}
                        {item.isAvailable ? 'Visible' : 'Hidden'}
                      </div>
                    </div>

                    <div className="font-medium text-[#d9ad5f]">
                      {item.price}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({ type: 'item', category, item })
                        }
                        className="rounded-lg bg-white/5 p-2"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(category, item)}
                        className="rounded-lg bg-red-500/10 p-2 text-red-300"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {editing?.type === 'item' &&
                      editing.item._id === item._id && (
                        <EditItem
                          item={item}
                          onCancel={() => setEditing(null)}
                          onSave={(payload) =>
                            updateItem(category, item, payload)
                          }
                        />
                      )}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(event) => addItem(category, event)}
                className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-[1fr_160px_100px_auto]"
              >
                <input
                  required
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
                  placeholder="New item"
                  value={itemForm.name}
                  onChange={(event) =>
                    setItemForm(category._id, 'name', event.target.value)
                  }
                />
                <input
                  required
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
                  placeholder="Price, e.g. Rs 250"
                  value={itemForm.price}
                  onChange={(event) =>
                    setItemForm(category._id, 'price', event.target.value)
                  }
                />
                <input
                  type="number"
                  min="0"
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
                  value={itemForm.sortOrder}
                  onChange={(event) =>
                    setItemForm(
                      category._id,
                      'sortOrder',
                      Number(event.target.value)
                    )
                  }
                />
                <button className="rounded-xl border border-[#d9ad5f]/40 px-4 py-2 text-sm text-[#d9ad5f] transition hover:bg-[#d9ad5f] hover:text-black">
                  Add item
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function EditCategory({ category, onCancel, onSave }) {
  const [form, setForm] = useState({
    title: category.title,
    subtitle: category.subtitle || '',
    sortOrder: category.sortOrder || 0,
    isActive: category.isActive !== false,
  });

  return (
    <div className="grid gap-3 border-b border-white/10 bg-black/10 p-5 sm:grid-cols-[1fr_1fr_100px_auto]">
      <input
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
        value={form.title}
        onChange={(event) =>
          setForm((previous) => ({ ...previous, title: event.target.value }))
        }
      />
      <input
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
        value={form.subtitle}
        onChange={(event) =>
          setForm((previous) => ({
            ...previous,
            subtitle: event.target.value,
          }))
        }
      />
      <input
        type="number"
        min="0"
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-[#d9ad5f]"
        value={form.sortOrder}
        onChange={(event) =>
          setForm((previous) => ({
            ...previous,
            sortOrder: Number(event.target.value),
          }))
        }
      />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 px-2 text-xs text-stone-400">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                isActive: event.target.checked,
              }))
            }
          />
          Visible
        </label>
        <button
          type="button"
          onClick={() => onSave(form)}
          className="rounded-lg bg-[#d9ad5f] p-2 text-black"
          aria-label="Save category"
        >
          <Save size={16} />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-white/5 p-2"
          aria-label="Cancel category edit"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function EditItem({ item, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: item.name,
    price: item.price,
    sortOrder: item.sortOrder || 0,
    isAvailable: item.isAvailable !== false,
  });

  return (
    <div className="w-full sm:ml-4 sm:max-w-2xl">
      <div className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:grid-cols-[1fr_120px_80px_110px_auto]">
        <input
          className="rounded-lg border border-white/10 bg-black/20 px-2 py-2 outline-none focus:border-[#d9ad5f]"
          value={form.name}
          onChange={(event) =>
            setForm((previous) => ({ ...previous, name: event.target.value }))
          }
        />
        <input
          className="rounded-lg border border-white/10 bg-black/20 px-2 py-2 outline-none focus:border-[#d9ad5f]"
          value={form.price}
          onChange={(event) =>
            setForm((previous) => ({ ...previous, price: event.target.value }))
          }
        />
        <input
          type="number"
          min="0"
          className="rounded-lg border border-white/10 bg-black/20 px-2 py-2 outline-none focus:border-[#d9ad5f]"
          value={form.sortOrder}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              sortOrder: Number(event.target.value),
            }))
          }
        />
        <label className="flex items-center gap-2 px-2 text-xs text-stone-400">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                isAvailable: event.target.checked,
              }))
            }
          />
          Visible
        </label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onSave(form)}
            className="rounded-lg bg-[#d9ad5f] p-2 text-black"
            aria-label="Save menu item"
          >
            <Save size={15} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-white/5 p-2"
            aria-label="Cancel item edit"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

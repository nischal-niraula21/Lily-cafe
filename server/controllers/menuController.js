import MenuCategory from '../models/MenuCategory.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const getPublicMenu = asyncHandler(async (req,res) => {
  const categories = await MenuCategory.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  const cleaned = categories.map(c => ({ ...c, items: (c.items || []).filter(i => i.isAvailable !== false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)) }));
  res.json({ categories: cleaned });
});

export const getAdminMenu = asyncHandler(async (req,res) => {
  const categories = await MenuCategory.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  categories.forEach(c => c.items?.sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)));
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req,res) => {
  const { title, subtitle='', sortOrder=0, isActive=true } = req.body;
  if (!title) throw httpError(400, 'Category title is required.');
  const category = await MenuCategory.create({ title, subtitle, sortOrder, isActive, items: [] });
  res.status(201).json({ message: 'Menu category created.', category });
});

export const updateCategory = asyncHandler(async (req,res) => {
  const allowed = ['title','subtitle','sortOrder','isActive'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const category = await MenuCategory.findByIdAndUpdate(req.params.categoryId, updates, { new:true, runValidators:true });
  if (!category) throw httpError(404, 'Menu category not found.');
  res.json({ message: 'Menu category updated.', category });
});

export const deleteCategory = asyncHandler(async (req,res) => {
  const category = await MenuCategory.findByIdAndDelete(req.params.categoryId);
  if (!category) throw httpError(404, 'Menu category not found.');
  res.json({ message: 'Menu category deleted.' });
});

export const createItem = asyncHandler(async (req,res) => {
  const { name, price, description='', sortOrder=0, isAvailable=true } = req.body;
  if (!name || !price) throw httpError(400, 'Item name and price are required.');
  const category = await MenuCategory.findById(req.params.categoryId);
  if (!category) throw httpError(404, 'Menu category not found.');
  category.items.push({ name, price, description, sortOrder, isAvailable });
  await category.save();
  res.status(201).json({ message: 'Menu item created.', category });
});

export const updateItem = asyncHandler(async (req,res) => {
  const category = await MenuCategory.findById(req.params.categoryId);
  if (!category) throw httpError(404, 'Menu category not found.');
  const item = category.items.id(req.params.itemId);
  if (!item) throw httpError(404, 'Menu item not found.');
  ['name','price','description','sortOrder','isAvailable'].forEach(key => { if (req.body[key] !== undefined) item[key] = req.body[key]; });
  await category.save();
  res.json({ message: 'Menu item updated.', item });
});

export const deleteItem = asyncHandler(async (req,res) => {
  const category = await MenuCategory.findById(req.params.categoryId);
  if (!category) throw httpError(404, 'Menu category not found.');
  const item = category.items.id(req.params.itemId);
  if (!item) throw httpError(404, 'Menu item not found.');
  item.deleteOne();
  await category.save();
  res.json({ message: 'Menu item deleted.' });
});

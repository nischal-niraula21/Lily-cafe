import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Cabin from '../models/Cabin.js';
import MenuCategory from '../models/MenuCategory.js';

const cabins = [
  { code: 'C1', name: 'Window View', capacity: '2-4 guests', bestFor: 'Couples & quiet dining', features: 'Private seating | Warm lighting', description: 'A compact, intimate cabin designed for private conversations and relaxed meals.', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=90' },
  { code: 'C2', name: 'Cozy Corner', capacity: '4-6 guests', bestFor: 'Friends & small celebrations', features: 'Sofa seating | Cozy ambience', description: 'A social private cabin with comfortable seating for small celebrations and get-togethers.', imageUrl: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=90' },
  { code: 'C3', name: 'Family Table', capacity: '4-6 guests', bestFor: 'Family dining', features: 'Spacious table | Private room', description: 'A calm family-friendly cabin with a balanced mix of comfort, privacy and space.', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1800&q=90' },
  { code: 'C4', name: 'Celebration Space', capacity: '6-8 guests', bestFor: 'Birthdays & gatherings', features: 'Large seating | Celebration ready', description: 'A larger setup for birthdays, casual celebrations and group dinners.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90' },
  { code: 'C5', name: 'Group Lounge', capacity: '8-10 guests', bestFor: 'Groups & special occasions', features: 'Premium space | Large group seating', description: "Lily's most spacious private cabin for groups and special occasions.", imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=90' },
];

const rawMenu = [
  ['Pure Veg Starters', 'CRISPY | FRESH | SOULFUL', [['Veg Pakora', 'Rs 180'], ['Onion Rings', 'Rs 200'], ['Chauchau Sadheko', 'Rs 160'], ['Aloo Sadheko', 'Rs 150'], ['Aloo Tareko', 'Rs 170'], ['Paneer Chilly (Dry/Gravy)', 'Rs 320'], ['Paneer Tikka', 'Rs 340'], ['Veg Spring Roll', 'Rs 220'], ['French Fries', 'Rs 180'], ['Chilly Mushroom', 'Rs 280']]],
  ['Chicken Specials', 'JUICY | SPICED | SATISFYING', [['Chicken Chilly (Dry/Gravy)', 'Rs 380'], ['Chicken Sadheko', 'Rs 350'], ['Chicken Tikka', 'Rs 380'], ['Chicken Fry', 'Rs 360'], ['Chicken Sekuwa', 'Rs 400'], ['Chicken Wings', 'Rs 420'], ['Chicken Choila', 'Rs 360'], ['Chicken Lollipop', 'Rs 430'], ['Chicken Roast', 'Rs 450'], ['Tandoori Chicken', 'Rs 520']]],
  ['Mutton Delights', 'SLOW COOKED | RICH | HEARTY', [['Mutton Curry', 'Rs 520'], ['Mutton Sadheko', 'Rs 480'], ['Mutton Chilly', 'Rs 540'], ['Mutton Sekuwa', 'Rs 560'], ['Mutton Fry', 'Rs 500'], ['Mutton Bhutuwa', 'Rs 540'], ['Mutton Rogan Josh', 'Rs 580'], ['Mutton Thali', 'Rs 650']]],
  ['Street Favorites', 'MOMO | CHOWMEIN | THUKPA', [['Veg Momo (Steam/Fry/Jhol)', 'Rs 140'], ['Chicken Momo (Steam/Fry/Jhol)', 'Rs 180'], ['Buff Momo', 'Rs 160'], ['C-Momo (Chilly Momo)', 'Rs 220'], ['Veg Chowmein', 'Rs 170'], ['Chicken Chowmein', 'Rs 200'], ['Mixed Chowmein', 'Rs 230'], ['Veg Thukpa', 'Rs 190'], ['Chicken Thukpa', 'Rs 220'], ['Wai Wai Sadheko', 'Rs 120']]],
  ['Rice & Bread', 'FROM THE TANDOOR & WOK', [['Steamed Rice', 'Rs 120'], ['Jeera Rice', 'Rs 180'], ['Veg Fried Rice', 'Rs 220'], ['Chicken Fried Rice', 'Rs 260'], ['Veg Biryani', 'Rs 320'], ['Chicken Biryani', 'Rs 380'], ['Plain Naan', 'Rs 60'], ['Butter Naan', 'Rs 80'], ['Garlic Naan', 'Rs 100'], ['Tandoori Roti', 'Rs 40']]],
  ['Soft Drinks & Hot Beverages', 'CHILLED | WARM | REFRESHING', [['Coca Cola / Fanta / Sprite', 'Rs 100'], ['Mineral Water', 'Rs 50'], ['Fresh Lime Soda', 'Rs 160'], ['Milk Tea', 'Rs 80'], ['Black Tea', 'Rs 60'], ['Hot Lemon', 'Rs 120'], ['Cappuccino', 'Rs 220'], ['Cafe Latte', 'Rs 240'], ['Hot Chocolate', 'Rs 260'], ['Fresh Lime Soda (Sweet/Salt)', 'Rs 180']]],
  ['Mocktails', 'FRESH | FRUITY | ZERO PROOF', [['Virgin Mojito', 'Rs 220'], ['Strawberry Breeze', 'Rs 260'], ['Mango Sunrise', 'Rs 260'], ['Blueberry Mint Cooler', 'Rs 280'], ['Pina Colada (Virgin)', 'Rs 280'], ['Shirley Temple', 'Rs 240'], ['Watermelon Cooler', 'Rs 240'], ['Lily Special Punch', 'Rs 300']]],
  ['Cocktails', 'CLASSIC | BOLD | SMOOTH', [['Classic Mojito', 'Rs 420'], ['Margarita', 'Rs 460'], ['Old Fashioned', 'Rs 520'], ['Pina Colada', 'Rs 480'], ['Whiskey Sour', 'Rs 500'], ['Cosmopolitan', 'Rs 460'], ['Bloody Mary', 'Rs 480'], ['Tequila Sunrise', 'Rs 500'], ['Lily Signature Martini', 'Rs 560']]],
  ['Ice Creams & Desserts', 'THE PERFECT FINALE', [['Vanilla Scoop', 'Rs 120'], ['Chocolate Fudge', 'Rs 160'], ['Strawberry Delight', 'Rs 160'], ['Sundae Special', 'Rs 280'], ['Brownie with Ice Cream', 'Rs 320'], ['Kulfi Falooda', 'Rs 240'], ['Gulab Jamun (2 pcs)', 'Rs 140'], ['Cheesecake Slice', 'Rs 280'], ['Tiramisu', 'Rs 320'], ['Banana Split', 'Rs 300']]],
];

try {
  await connectDB();
  for (const cabin of cabins) await Cabin.findOneAndUpdate({ code: cabin.code }, { $setOnInsert: { ...cabin, availability: 'available' } }, { upsert: true, new: true });
  if (await MenuCategory.countDocuments() === 0) {
    await MenuCategory.insertMany(rawMenu.map(([title, subtitle, items], index) => ({ title, subtitle, sortOrder: index + 1, isActive: true, items: items.map(([name, price], i) => ({ name, price, sortOrder: i + 1, isAvailable: true })) })));
    console.log('Default menu inserted.');
  } else console.log('Menu already exists; skipped menu seed.');
  console.log('Cabins C1-C5 are ready.');
} catch (error) { console.error(error); process.exitCode = 1; } finally { await mongoose.disconnect(); }

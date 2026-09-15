export const fallbackCabins = [
  { code: 'C1', capacity: '2-4 guests', features: 'Private seating | Cozy ambience', description: 'A comfortable private cabin for dining, conversations and small gatherings.', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=90', availability: 'available' },
  { code: 'C2', capacity: '4-6 guests', features: 'Private seating | Cozy ambience', description: 'A comfortable private cabin for dining, conversations and small gatherings.', imageUrl: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=90', availability: 'available' },
  { code: 'C3', capacity: '4-6 guests', features: 'Private seating | Cozy ambience', description: 'A comfortable private cabin for dining, conversations and small gatherings.', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1800&q=90', availability: 'available' },
  { code: 'C4', capacity: '6-8 guests', features: 'Private seating | Cozy ambience', description: 'A comfortable private cabin for dining, conversations and group gatherings.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90', availability: 'available' },
  { code: 'C5', capacity: '8-10 guests', features: 'Private seating | Cozy ambience', description: 'A comfortable private cabin for dining, conversations and group gatherings.', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=90', availability: 'available' },
];

export const fallbackMenu = [
  { title: 'Pure Veg Starters', subtitle: 'CRISPY | FRESH | SOULFUL', sortOrder: 1, items: [
    ['Veg Pakora','Rs 180'],['Onion Rings','Rs 200'],['Chauchau Sadheko','Rs 160'],['Aloo Sadheko','Rs 150'],['Aloo Tareko','Rs 170'],['Paneer Chilly (Dry/Gravy)','Rs 320'],['Paneer Tikka','Rs 340'],['Veg Spring Roll','Rs 220'],['French Fries','Rs 180'],['Chilly Mushroom','Rs 280']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Chicken Specials', subtitle: 'JUICY | SPICED | SATISFYING', sortOrder: 2, items: [
    ['Chicken Chilly (Dry/Gravy)','Rs 380'],['Chicken Sadheko','Rs 350'],['Chicken Tikka','Rs 380'],['Chicken Fry','Rs 360'],['Chicken Sekuwa','Rs 400'],['Chicken Wings','Rs 420'],['Chicken Choila','Rs 360'],['Chicken Lollipop','Rs 430'],['Chicken Roast','Rs 450'],['Tandoori Chicken','Rs 520']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Mutton Delights', subtitle: 'SLOW COOKED | RICH | HEARTY', sortOrder: 3, items: [
    ['Mutton Curry','Rs 520'],['Mutton Sadheko','Rs 480'],['Mutton Chilly','Rs 540'],['Mutton Sekuwa','Rs 560'],['Mutton Fry','Rs 500'],['Mutton Bhutuwa','Rs 540'],['Mutton Rogan Josh','Rs 580'],['Mutton Thali','Rs 650']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Street Favorites', subtitle: 'MOMO | CHOWMEIN | THUKPA', sortOrder: 4, items: [
    ['Veg Momo (Steam/Fry/Jhol)','Rs 140'],['Chicken Momo (Steam/Fry/Jhol)','Rs 180'],['Buff Momo','Rs 160'],['C-Momo (Chilly Momo)','Rs 220'],['Veg Chowmein','Rs 170'],['Chicken Chowmein','Rs 200'],['Mixed Chowmein','Rs 230'],['Veg Thukpa','Rs 190'],['Chicken Thukpa','Rs 220'],['Wai Wai Sadheko','Rs 120']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Rice & Bread', subtitle: 'FROM THE TANDOOR & WOK', sortOrder: 5, items: [
    ['Steamed Rice','Rs 120'],['Jeera Rice','Rs 180'],['Veg Fried Rice','Rs 220'],['Chicken Fried Rice','Rs 260'],['Veg Biryani','Rs 320'],['Chicken Biryani','Rs 380'],['Plain Naan','Rs 60'],['Butter Naan','Rs 80'],['Garlic Naan','Rs 100'],['Tandoori Roti','Rs 40']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Soft Drinks & Hot Beverages', subtitle: 'CHILLED | WARM | REFRESHING', sortOrder: 6, items: [
    ['Coca Cola / Fanta / Sprite','Rs 100'],['Mineral Water','Rs 50'],['Fresh Lime Soda','Rs 160'],['Milk Tea','Rs 80'],['Black Tea','Rs 60'],['Hot Lemon','Rs 120'],['Cappuccino','Rs 220'],['Cafe Latte','Rs 240'],['Hot Chocolate','Rs 260'],['Fresh Lime Soda (Sweet/Salt)','Rs 180']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Mocktails', subtitle: 'FRESH | FRUITY | ZERO PROOF', sortOrder: 7, items: [
    ['Virgin Mojito','Rs 220'],['Strawberry Breeze','Rs 260'],['Mango Sunrise','Rs 260'],['Blueberry Mint Cooler','Rs 280'],['Pina Colada (Virgin)','Rs 280'],['Shirley Temple','Rs 240'],['Watermelon Cooler','Rs 240'],['Lily Special Punch','Rs 300']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Cocktails', subtitle: 'CLASSIC | BOLD | SMOOTH', sortOrder: 8, items: [
    ['Classic Mojito','Rs 420'],['Margarita','Rs 460'],['Old Fashioned','Rs 520'],['Pina Colada','Rs 480'],['Whiskey Sour','Rs 500'],['Cosmopolitan','Rs 460'],['Bloody Mary','Rs 480'],['Tequila Sunrise','Rs 500'],['Lily Signature Martini','Rs 560']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
  { title: 'Ice Creams & Desserts', subtitle: 'THE PERFECT FINALE', sortOrder: 9, items: [
    ['Vanilla Scoop','Rs 120'],['Chocolate Fudge','Rs 160'],['Strawberry Delight','Rs 160'],['Sundae Special','Rs 280'],['Brownie with Ice Cream','Rs 320'],['Kulfi Falooda','Rs 240'],['Gulab Jamun (2 pcs)','Rs 140'],['Cheesecake Slice','Rs 280'],['Tiramisu','Rs 320'],['Banana Split','Rs 300']
  ].map(([name,price],i)=>({name,price,sortOrder:i+1,isAvailable:true}))},
];

export const fallbackGallery = [
  ['terrace.webp','Lily Cafe terrace seating'],
  ['coffee-tray.webp','Coffee service at Lily'],
  ['chilli-platter.webp','A colorful savoury dish at Lily'],
  ['green-red-mocktails.webp','Two colorful mocktails at Lily'],
  ['family-celebration.webp','Guests celebrating at Lily'],
  ['pool-room.webp','Pool tables at Lily'],
  ['shakes.webp','Two chilled drinks at Lily'],
  ['hallway.webp','Interior hallway at Lily'],
  ['fried-bites.webp','Crispy bites served at Lily'],
  ['spicy-ribs.webp','Spicy plated dish at Lily'],
  ['latte-glass.webp','Layered coffee at Lily'],
  ['fried-cutlets.webp','Crispy cutlets at Lily'],
  ['blue-orange-mocktail.webp','Blue and orange mocktail at Lily'],
  ['mason-mocktails.webp','Mason jar mocktails at Lily'],
  ['large-gathering.webp','Large gathering at Lily Cafe'],
].map(([file,alt],i)=>({ _id:`fallback-${i}`, url:`/assets/photos/${file}`, alt, sortOrder:i+1 }));

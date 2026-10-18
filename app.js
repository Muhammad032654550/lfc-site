/**
 * LFC (Lahore Fried Chicken) - Official Web Application
 * Pure Standard JavaScript (Zero Build Required, 100% Vite & GitHub Pages Compatible)
 * Advanced Multi-Options System, Live Kitchen Orders Tracker, Promo Engine & Delivery Suite
 * Developer: Trivox solutions
 */

(function () {
  'use strict';

  // --- Initial Preset Data ---
  let syncing = false, syncPending = false, syncTimer = null, remoteSyncing = false, selfSaving = false, applyingRemote = false;
  const SYNC_KEYS = ['hero_slides', 'hero_config', 'menu_items', 'categories', 'settings', 'branches'];
  const DEFAULT_SETTINGS = {
    storeName: 'LFC',
    fullName: 'Lahore Fried Chicken (LFC)',
    tagline: 'Taste the Legend',
    logoUrl: './images/logo.png',
    phoneCallNumber: '0322-4940181',
    whatsappNumber: '0322-4940181',
    adminPin: '5640', // Protected Master Admin PIN
    deliveryFee: 150,
    freeDeliveryAbove: 1000,
    storeTiming: '12:00 PM - 02:30 AM',
    currency: 'Rs.',
    storeStatus: 'open', // 'open' | 'busy' | 'closed'
    selectedZoneId: 'gulberg',
    announcementText: '🔥 Free Delivery in Lahore on Orders Above Rs. 1,000! | Code: LFC100 for Rs. 100 OFF'
  };

  const DEFAULT_ZONES = [
    { id: 'gulberg', name: 'Gulberg & MM Alam Road', fee: 150, time: 'Fast Delivery' },
    { id: 'dha', name: 'DHA Lahore (Phases 1-8)', fee: 200, time: 'Fast Delivery' },
    { id: 'johar', name: 'Johar Town & Faisal Town', fee: 180, time: 'Fast Delivery' },
    { id: 'modeltown', name: 'Model Town & Garden Town', fee: 160, time: 'Fast Delivery' },
    { id: 'cantt', name: 'Lahore Cantt & Saddar', fee: 190, time: 'Fast Delivery' },
    { id: 'bahria', name: 'Bahria Town & Raiwind Road', fee: 250, time: 'Fast Delivery' },
    { id: 'mall', name: 'Mall Road, Anarkali & Old Lahore', fee: 170, time: 'Fast Delivery' },
    { id: 'other', name: 'Other Areas in Lahore', fee: 220, time: 'Fast Delivery' }
  ];

  const DEFAULT_PROMOS = [
    { code: 'LFC100', type: 'flat', discount: 100, minOrder: 800, active: true, desc: 'Rs. 100 OFF on orders above Rs. 800' },
    { code: 'CRUNCH20', type: 'percent', discount: 20, minOrder: 1500, active: true, desc: '20% OFF on orders above Rs. 1,500' },
    { code: 'WELCOME50', type: 'flat', discount: 50, minOrder: 500, active: true, desc: 'Rs. 50 OFF on first order' },
    { code: 'TRIVOX', type: 'flat', discount: 200, minOrder: 1200, active: true, desc: 'Rs. 200 Special Partner Discount' }
  ];

  const DEFAULT_CATEGORIES = [
    { id: "all", name: "All Bites" },
    { id: "burgers", name: "Burgers & Rolls" },
    { id: "chicken", name: "Fried Chicken" },
    { id: "wings", name: "Wings & Nuggets" },
    { id: "pizzas", name: "Pizzas · B1G1" },
    { id: "deals", name: "Hot Deals" },
    { id: "family", name: "Family & Big Deals" },
    { id: "midnight", name: "Midnight Deals" },
    { id: "sides", name: "Sides & Drinks" }
  ];

  const DEFAULT_HERO_SLIDES = [
    {
      id: 1,
      title: 'THE ULTIMATE CRISPY',
      highlight: 'FAMILY FEAST',
      subtitle: 'Signature Zinger burger, golden crunch bucket, cheesy pizza slice, paratha roll and tender strips in one legendary combo.',
      badgeText: '#1 Crispy Chicken in Lahore',
      image: './images/hero-1.jpg?v=20261017',
      priceTag: 'Rs. 2,500',
      tag: 'Grand Feast',
      rating: '4.9 ★ (1,840+ reviews)',
      ctaText: 'Order Feast Now',
      targetDealId: 50
    },
    {
      id: 2,
      title: 'LFC CRISPY CHICKEN',
      highlight: 'ZINGER ROLL',
      subtitle: 'Tender golden crispy chicken strips wrapped in a freshly grilled flaky paratha with signature garlic sauce and sliced onions.',
      badgeText: 'Lahore Street Special',
      image: './images/hero-2.jpg?v=20261017',
      priceTag: 'Rs. 500',
      tag: 'Street Legend',
      rating: '4.8 ★ (920+ reviews)',
      ctaText: 'Grab A Roll',
      targetDealId: 58
    },
    {
      id: 3,
      title: 'HOT EXTRA CHEESY',
      highlight: 'LOADED PIZZA',
      subtitle: 'Loaded with premium mozzarella cheese pull, spicy grilled chicken cubes, black olives and sliced crunchy capsicums.',
      badgeText: 'Chef Recommended',
      image: './images/hero-3.jpg?v=20261017',
      priceTag: 'From Rs. 1,000',
      tag: 'Cheesy Melt',
      rating: '4.9 ★ (1,230+ reviews)',
      ctaText: 'Order Hot Pizza',
      targetDealId: 27
    },
    {
      id: 4,
      title: '9-PIECE SIGNATURE',
      highlight: 'ZINGER BUCKET',
      subtitle: 'Nine pieces of legendary 12-spice recipe fried chicken, sizzling hot and super juicy inside with ultra-crunchy crust.',
      badgeText: 'Weekend Bestseller',
      image: './images/hero-4.jpg?v=20261017',
      priceTag: 'From Rs. 200',
      tag: 'Mega Crunch',
      rating: '5.0 ★ (2,410+ reviews)',
      ctaText: 'Get The Bucket',
      targetDealId: 13
    }
  ];

  function menuArt(emoji) {
    const n = Array.from(emoji.replace(/\s/g, '')).length;
    const fs = n <= 1 ? 140 : n === 2 ? 108 : n === 3 ? 88 : 72;
    let rays = '';
    for (let i = 0; i < 14; i++) { const a = (i * 360) / 14, r = 460, w = 5; const p = (d) => `${(Math.cos(((a + d) * Math.PI) / 180) * r).toFixed(0)},${(Math.sin(((a + d) * Math.PI) / 180) * r).toFixed(0)}`; rays += `<polygon points="0,0 ${p(-w)} ${p(w)}" fill="#fff" opacity=".13"/>`; }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><radialGradient id="g" cx="50%" cy="46%" r="78%"><stop offset="0" stop-color="#FEF08A"/><stop offset=".35" stop-color="#FACC15"/><stop offset=".68" stop-color="#EF4444"/><stop offset="1" stop-color="#7F1D1D"/></radialGradient><radialGradient id="v" cx="50%" cy="50%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="7"/></filter><filter id="s"><feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#450a0a" flood-opacity=".7"/></filter></defs><rect width="400" height="300" fill="url(#g)"/><g transform="translate(200 140)">${rays}</g><g filter="url(#b)" fill="#fff"><circle cx="58" cy="70" r="26" opacity=".2"/><circle cx="345" cy="58" r="20" opacity=".18"/><circle cx="330" cy="215" r="30" opacity=".12"/><circle cx="80" cy="225" r="18" opacity=".16"/></g><ellipse cx="200" cy="232" rx="105" ry="15" fill="#2a0505" opacity=".5" filter="url(#b)"/><text x="200" y="${n <= 1 ? 195 : 188}" font-size="${fs}" text-anchor="middle" filter="url(#s)" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${emoji}</text><rect width="400" height="300" fill="url(#v)"/><rect width="400" height="20" fill="#000" opacity=".7"/><rect y="280" width="400" height="20" fill="#000" opacity=".7"/></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  const M = (id, name, cat, price, desc, emoji, badge, spiciness, sizes, spiceLevels, addons) => ({ id, name, cat, price, desc, image: menuArt(emoji), art: emoji, badge, inStock: true, spiciness, sizes, spiceLevels, addons });
  const DEFAULT_MENU_ITEMS = [
    M(1, "Zinger Burger", "burgers", 350, "Crispy golden zinger fillet with fresh lettuce and creamy sauce in a soft toasted bun.", "🍔🍗", "Bestseller", 2, [], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(2, "Mighty Zinger", "burgers", 600, "Our biggest zinger — a thick, juicy crunchy fillet stacked high for serious appetites.", "🍔", "Mighty", 2, [], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(3, "Tower Zinger", "burgers", 500, "Zinger fillet with a golden cheesy tower layer, crisp lettuce and signature sauce.", "🍔🧀", "Fan Favourite", 2, [], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(4, "Pizza Paratha", "burgers", 500, "Flaky paratha loaded with pizza-style chicken, melted cheese and tangy sauce.", "🫓🍕", "", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(5, "Chicken Burger", "burgers", 250, "Classic juicy chicken patty burger with fresh veggies and mayo.", "🍔", "", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(6, "Tikka Burger", "burgers", 300, "Spiced chicken tikka patty with onion rings, crunchy salad and mint mayo.", "🍔", "", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(7, "Tikka Patty Burger", "burgers", 500, "Extra-large tikka patty burger packed with cheese and our special sauce.", "🍔🔥", "New", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(8, "Fillet Zinger + Cheese + Garlic Sauce", "burgers", 450, "Fillet zinger with a slice of melted cheese and rich garlic sauce.", "🍔🧄", "New", 2, [], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(9, "Pizza Burger", "burgers", 500, "Crispy chicken burger with pizza sauce and a molten cheese crown.", "🍔🍕", "", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(10, "Chicken Paratha Roll", "burgers", 350, "Tender seasoned chicken with sauces and salad rolled in a hot flaky paratha.", "🌯", "", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(11, "Kabab Paratha", "burgers", 300, "Smoky seekh kabab wrapped in crispy paratha with chutney and onions.", "🫓🍢", "", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(12, "Chicken Shawarma", "burgers", 300, "Juicy shawarma chicken, garlic sauce and pickles in warm pita bread.", "🌯", "", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(13, "Fried Chicken (Pieces)", "chicken", 200, "Crispy broasted chicken, marinated in 12 spices and fried golden. Choose your pieces.", "🍗", "Crispy", 1, [{"name": "1 Pc.", "price": 0}, {"name": "2 Pcs.", "price": 180}, {"name": "5 Pcs.", "price": 700}, {"name": "10 Pcs.", "price": 1600}], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(14, "Chicken Boneless Pc", "chicken", 280, "Tender boneless chicken piece with a crunchy golden coating.", "🍗", "", 1, [], ["Regular", "Extra Spicy"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(15, "Hot Wings", "wings", 300, "Fiery, crispy chicken wings tossed in our signature hot sauce.", "🍗🔥", "Hot", 2, [{"name": "5 Pcs.", "price": 0}, {"name": "10 Pcs.", "price": 300}], ["Regular"], [{"name": "Dip Sauce", "price": 50}]),
    M(16, "Hot Shots", "wings", 300, "Bite-size crunchy chicken shots with a spicy kick.", "🍗", "", 2, [{"name": "5 Pcs.", "price": 0}, {"name": "10 Pcs.", "price": 300}], ["Regular"], [{"name": "Dip Sauce", "price": 50}]),
    M(17, "Nuggets", "wings", 300, "Golden crispy chicken nuggets, perfect for sharing.", "🍗", "", 0, [{"name": "5 Pcs.", "price": 0}, {"name": "10 Pcs.", "price": 300}], ["Regular"], [{"name": "Dip Sauce", "price": 50}]),
    M(18, "Chicken Tikka", "pizzas", 1000, "Chicken tikka, onion, black olives, cheese and green capsicum.", "🍕", "Buy 1 Get 1 Free", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 800}, {"name": "Large 13\"", "price": 1400}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(19, "Chicken Fajita", "pizzas", 1000, "Chicken fajita, onion, tomato, mushroom and cheese.", "🍕", "Buy 1 Get 1 Free", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 800}, {"name": "Large 13\"", "price": 1400}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(20, "Chicken Creamy", "pizzas", 1050, "Chicken, onion, cream and cheese.", "🍕", "Buy 1 Get 1 Free", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 800}, {"name": "Large 13\"", "price": 1400}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(21, "Supreme Pizza", "pizzas", 1050, "Chicken tikka, onion, pepperoni, olives and cheese.", "🍕", "Buy 1 Get 1 Free", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 800}, {"name": "Large 13\"", "price": 1400}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(22, "Malai Boti Pizza", "pizzas", 1050, "Chicken malai boti, onion and cheese.", "🍕", "Buy 1 Get 1 Free", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 850}, {"name": "Large 13\"", "price": 1550}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(23, "Seekh Kabab Pizza", "pizzas", 1050, "Chicken seekh kabab, onion, green capsicum and cheese.", "🍕", "Buy 1 Get 1 Free", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 850}, {"name": "Large 13\"", "price": 1500}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(24, "Chicken Hot & Spicy Pizza", "pizzas", 1000, "Spicy chicken, onion, olives, green capsicum and cheese.", "🍕🔥", "Buy 1 Get 1 Free", 2, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 800}, {"name": "Large 13\"", "price": 1400}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(25, "Kabab Crust Pizza", "pizzas", 1150, "Cheesy pizza with a seekh kabab stuffed crust.", "🍕", "Buy 1 Get 1 Free", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 950}, {"name": "Large 13\"", "price": 1650}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(26, "Lazania Pizza", "pizzas", 1150, "Lasagna-style pizza with creamy layers and melted cheese.", "🍝🍕", "Buy 1 Get 1 Free", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 950}, {"name": "Large 13\"", "price": 1650}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(27, "LFC Special Pizza", "pizzas", 1000, "Chicken tikka, green capsicum, onion, tomato, pepperoni, mushrooms and olives.", "🍕⭐", "LFC Special", 1, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 900}, {"name": "Large 13\"", "price": 1500}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(28, "Single Side Filling Pizza", "pizzas", 600, "Cheese, chicken tikka, olives, onion and green capsicum.", "🍕", "", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 500}, {"name": "Large 13\"", "price": 850}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(29, "Malai Pizza (Single)", "pizzas", 550, "Creamy malai chicken pizza, single.", "🍕", "", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 550}, {"name": "Large 13\"", "price": 950}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(30, "Single Pizza", "pizzas", 500, "Classic single pizza, cheesy and fresh.", "🍕", "", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 450}, {"name": "Large 13\"", "price": 800}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(31, "Kabab Crust Pizza (Single)", "pizzas", 600, "Single kabab crust pizza.", "🍕", "", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 500}, {"name": "Large 13\"", "price": 950}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(32, "Crown Crust Pizza (Single)", "pizzas", 600, "Single crown crust pizza with a cheese-stuffed border.", "🍕", "", 0, [{"name": "Small 7\"", "price": 0}, {"name": "Medium 10\"", "price": 550}, {"name": "Large 13\"", "price": 950}], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(33, "Hot Deal 1", "deals", 550, "1 Zinger, 1 Reg Fries, 1 (500ml) Drink", "🍔🍟🥤", "Value Deal", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(34, "Hot Deal 2", "deals", 700, "1 Tower Zinger, 1 Reg Fries, 1 (500ml) Drink", "🍔🍟🥤", "Hot Deal", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(35, "Hot Deal 3", "deals", 620, "1 Zinger, 1 Pc. Chicken, 1 Reg Fries, 1 (500ml) Drink", "🍔🍗🍟", "Hot Deal", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(36, "Hot Deal 4", "deals", 450, "1 Chicken Burger, 1 Reg Fries, 1 (500ml) Drink", "🍔🍟🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(37, "Hot Deal 5", "deals", 750, "2 Zinger, 1 (500ml) Drink", "🍔🍔🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(38, "Hot Deal 6", "deals", 600, "1 Platter Shawarma, 1 (500ml) Drink", "🌯🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(39, "Hot Deal 7", "deals", 700, "1 Mighty Zinger, 1 Reg Fries, 1 (500ml) Drink", "🍔🍟🥤", "Hot Deal", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(40, "Hot Deal 8", "deals", 1400, "4 Junior Zinger, 1 Family Fries, 1 1.5 Ltr. Drink", "🍔🍟🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(41, "Hot Deal 9", "deals", 570, "1 Pizza Burger, 1 (500ml) Drink", "🍔🍕🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(42, "Hot Deal 10", "deals", 650, "3 Pcs. Chicken, 1 (500ml) Drink", "🍗🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(43, "Hot Deal 11", "deals", 1200, "1 Small Pizza, 5 Nuggets, 5 Hot Wings, 1 Large Fries, 1 0.5 Ltr Coke", "🍕🍗🍟🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(44, "Hot Deal 12", "deals", 2100, "1 Medium Pizza, 10 Nuggets, 1.5 Ltr Coke, 2 Paratha Rolls", "🍕🍗🌯🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(45, "Hot Deal 13", "deals", 570, "1 Pizza Paratha, 1 (500ml) Drink", "🫓🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(46, "Hot Deal 14", "deals", 670, "10 Pcs Hot Wings, 1 (500ml) Drink", "🍗🔥🥤", "Hot Deal", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(47, "Hot Deal 15", "deals", 2650, "5 Tower Zinger, 1 1.5 Ltr. Drink", "🍔🍔🥤", "Hot Deal", 0, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}]),
    M(48, "Family Combo 1", "family", 1800, "4 Chicken Burgers, 1 Family Fries, 10 Nuggets, 1 1.5 Ltr. Drink", "🍗🍔🍟🥤", "Family", 1, [], ["Regular"], [{"name": "Dip Sauce", "price": 50}, {"name": "Extra Cheese", "price": 60}]),
    M(49, "Family Combo 2", "family", 2050, "5 Zinger, 1 Family Fries, 1 1.5 Ltr. Drink", "🍗🍔🍟🥤", "Family", 1, [], ["Regular"], [{"name": "Dip Sauce", "price": 50}, {"name": "Extra Cheese", "price": 60}]),
    M(50, "Family Combo 3", "family", 2500, "5 Pc. Chicken, 3 Zinger, 1 Family Fries, 1 1.5 Ltr. Drink", "🍗🍔🍟🥤", "Most Ordered", 1, [], ["Regular"], [{"name": "Dip Sauce", "price": 50}, {"name": "Extra Cheese", "price": 60}]),
    M(51, "Family Combo 4", "family", 4400, "1 Single Medium Zinger Burger, 1 Family Fries, 2 1.5 Ltr Drinks, 6 Pc Chicken", "🍗🍔🍟🥤", "Family", 1, [], ["Regular"], [{"name": "Dip Sauce", "price": 50}, {"name": "Extra Cheese", "price": 60}]),
    M(52, "Big Deal 1", "family", 3700, "2 P. Roll, 2 Zinger, 10 Hot Wings, 10 Nuggets, F. Fries, 2 x S. Pizza, 2 1.5 Ltr. Drink", "🍕🍗🍟🥤", "Mega Deal", 1, [], ["Regular"], []),
    M(53, "Big Deal 2", "family", 5400, "3 P. Roll, 10 Pc Hotwing, 10 Pc Nuggets, 5 Zinger, 1 Single Large, 2 1.5 Ltr. Drink, 2 Family Fries", "🍕🍗🍟🥤", "Mega Deal", 1, [], ["Regular"], []),
    M(54, "Grill Burger", "midnight", 500, "Midnight special — flame-grilled chicken burger with melted cheese.", "🍔🔥", "Midnight", 1, [], ["Regular"], [{"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Extra Bun", "price": 60}, {"name": "Reg. Drink", "price": 70}]),
    M(55, "Loaded Fries", "midnight", 500, "Crispy fries loaded with chicken, cheese and drizzled sauces.", "🍟🧀", "Midnight", 1, [], ["Regular"], []),
    M(56, "Zinger Wrap", "midnight", 500, "Crispy zinger strips wrapped with fresh veggies and sauce.", "🌯", "Midnight", 1, [], ["Regular"], []),
    M(57, "Zinger Wrap (Large)", "midnight", 320, "Large zinger wrap, midnight price.", "🌯", "Midnight", 1, [], ["Regular"], []),
    M(58, "Zinger Paratha Roll", "midnight", 500, "Crispy zinger inside a hot flaky paratha with garlic sauce.", "🫓🍗", "Midnight", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(59, "Zinger Paratha Roll (Large)", "midnight", 320, "Large zinger paratha roll, midnight price.", "🫓🍗", "Midnight", 1, [], ["Regular"], [{"name": "Extra Paratha", "price": 60}, {"name": "Extra Cheese", "price": 60}, {"name": "Dip Sauce", "price": 50}, {"name": "Reg. Drink", "price": 70}]),
    M(60, "Zinger Shawarma (Large)", "midnight", 320, "Large zinger shawarma, midnight price.", "🌯", "Midnight", 1, [], ["Regular"], []),
    M(61, "Club Sandwich", "midnight", 500, "Triple-decker club sandwich with chicken, egg, cheese and fries.", "🥪🍟", "Midnight", 0, [], ["Regular"], []),
    M(62, "French Fries", "sides", 200, "Hot, crispy golden fries with a pinch of masala.", "🍟", "", 0, [{"name": "Large", "price": 0}, {"name": "Family", "price": 200}], ["Regular"], [{"name": "Dip Sauce", "price": 50}, {"name": "Extra Cheese", "price": 60}]),
    M(63, "Soft Drink", "sides", 70, "Chilled soft drink of your choice.", "🥤", "", 0, [{"name": "Regular", "price": 0}, {"name": "0.5 Litre", "price": 30}, {"name": "1.5 Litre", "price": 130}], ["Regular"], []),
    M(64, "Mineral Water", "sides", 70, "Pure chilled drinking water.", "💧", "", 0, [{"name": "0.5 Litre", "price": 0}, {"name": "1.5 Litre", "price": 50}], ["Regular"], []),
    M(65, "Extra Cheese", "sides", 60, "Extra cheese slice or topping.", "🧀", "", 0, [], ["Regular"], []),
    M(66, "Dip Sauce", "sides", 50, "Garlic, chili or mayo dip.", "🥫", "", 0, [], ["Regular"], []),
    M(67, "Extra Bread", "sides", 60, "Extra bread.", "🍞", "", 0, [], ["Regular"], []),
    M(68, "Extra Bun", "sides", 60, "Extra burger bun.", "🍞", "", 0, [], ["Regular"], []),
    M(69, "Extra Paratha", "sides", 60, "Extra fresh paratha.", "🫓", "", 0, [], ["Regular"], []),
    M(70, "Disposable Glass", "sides", 10, "Disposable glass.", "🥛", "", 0, [], ["Regular"], [])
  ];

  const DEFAULT_BRANCHES = [
    {
      id: 1,
      name: 'LFC - (Manawan): Ram Pura',
      address: '(Manawan): Ram Pura Near Masjid Yousafia Manawan Lahore',
      phone: '0322-4940181',
      timings: '3:00 PM to 3:00 AM',
      mapUrl: 'https://maps.google.com/?q=Ram+Pura+Near+Masjid+Yousafia+Manawan+Lahore'
    },
    {
      id: 2,
      name: 'LFC - Daroghawala Mehmood Booti Station, Lahore',
      address: 'Mehmood Boti Metro train station, 31B Grand Trunk Rd, Daroghawala, Lahore, 54920, Pakistan',
      phone: '03223393333',
      timings: '3:00 PM to 3:00 AM',
      mapUrl: 'https://maps.google.com/?q=Mehmood+Boti+Metro+train+station,+31B+Grand+Trunk+Rd,+Daroghawala,+Lahore,+54920,+Pakistan'
    }
  ];

  const DEFAULT_REVIEWS = [
    {
      id: 1,
      name: 'Hamza Malik',
      location: 'Gulberg III, Lahore',
      rating: 5,
      date: 'Yesterday',
      comment: 'Hands down the crispiest Zinger in Lahore! The crust has a real crunch that stays crispy during delivery, and the garlic dip is heavenly.'
    },
    {
      id: 2,
      name: 'Ayesha Tariq',
      location: 'DHA Phase 5, Lahore',
      rating: 5,
      date: '3 days ago',
      comment: 'Their Loaded Cheese Pizza and Fried Chicken Bucket deal made our family weekend dinner unforgettable. Super fast WhatsApp ordering!'
    },
    {
      id: 3,
      name: 'Bilal Farooq',
      location: 'Johar Town, Lahore',
      rating: 5,
      date: '1 week ago',
      comment: 'The Zinger Paratha Roll is pure Lahori street food magic. Sizzling chicken strips with flaky crispy paratha. 10/10 recommend.'
    }
  ];

  const DEFAULT_ORDERS = [
    {
      id: 'LFC-8491',
      date: '10:45 PM today',
      timestamp: Date.now() - 3600000,
      customerName: 'Usman Tariq',
      customerPhone: '0300-8456123',
      customerAddress: 'House 14, Block B, DHA Phase 5, Lahore',
      orderType: 'delivery',
      deliveryZone: 'DHA Lahore (Phases 1-8)',
      specialNotes: 'Extra spicy, please send garlic dip',
      items: [
        {
          name: 'Crispy Zinger Burger',
          price: 740,
          qty: 2,
          selectedSize: { name: 'Double Patty Zinger', price: 180 },
          selectedSpice: 'Hot Spicy Lahori',
          selectedAddons: [{ name: 'Extra Garlic Mayo Dip', price: 60 }]
        },
        {
          name: 'Peri Peri Masala Fries',
          price: 240,
          qty: 1,
          selectedSize: { name: 'Regular Portion', price: 0 },
          selectedSpice: 'Hot Spicy Lahori',
          selectedAddons: []
        }
      ],
      subtotal: 1720,
      deliveryFee: 200,
      discount: 100,
      promoCode: 'LFC100',
      total: 1820,
      status: 'delivered'
    },
    {
      id: 'LFC-8492',
      date: '11:20 PM today',
      timestamp: Date.now() - 1800000,
      customerName: 'Sana Farooq',
      customerPhone: '0321-4991122',
      customerAddress: 'Plot 42, Main MM Alam Road, Gulberg III, Lahore',
      orderType: 'delivery',
      deliveryZone: 'Gulberg & MM Alam Road',
      specialNotes: 'Ring bell twice, leave with guard if needed',
      items: [
        {
          name: 'Extra Cheese Loaded Pizza',
          price: 1740,
          qty: 1,
          selectedSize: { name: 'Medium 10"', price: 450 },
          selectedSpice: 'Mild Italian Herb',
          selectedAddons: []
        },
        {
          name: 'Chilled Soft Drink (1.5L)',
          price: 220,
          qty: 1,
          selectedSize: { name: '1.5L Bottle', price: 0 },
          selectedSpice: 'Ice Cold',
          selectedAddons: []
        }
      ],
      subtotal: 1960,
      deliveryFee: 150,
      discount: 0,
      promoCode: null,
      total: 2110,
      status: 'preparing'
    },
    {
      id: 'LFC-8493',
      date: '11:42 PM today',
      timestamp: Date.now() - 600000,
      customerName: 'Hamza Bilal',
      customerPhone: '0333-8821940',
      customerAddress: 'Sector G1, Near Doctors Hospital, Johar Town, Lahore',
      orderType: 'delivery',
      deliveryZone: 'Johar Town & Faisal Town',
      specialNotes: 'Crispy fried chicken pieces fresh please',
      items: [
        {
          name: '9-Piece Zinger Bucket',
          price: 2100,
          qty: 1,
          selectedSize: { name: '9-Piece Regular Bucket', price: 0 },
          selectedSpice: 'Hot Spicy 12-Spice',
          selectedAddons: [
            { name: 'Extra 2x Garlic Mayo Dips', price: 110 },
            { name: 'Extra Peri Peri Masala Fries', price: 150 }
          ]
        }
      ],
      subtotal: 2280,
      deliveryFee: 0,
      discount: 200,
      promoCode: 'TRIVOX',
      total: 2080,
      status: 'new'
    }
  ];

  const PROMO_TICKERS = [
    '🔥 Big flavor. Golden crunch. That’s the LFC way.',
    '🍗 Make tonight a crispy chicken night.',
    '🌶️ Turn up the taste with bold Lahori flavor.',
    '🍔 Find your new favorite bite on the LFC menu.',
    '✨ Good food, great vibes, legendary LFC flavor.'
  ];

  // --- LocalStorage Persistence with Defaults Merging ---
  function loadData(key, fallback) {
    try {
      const saved = localStorage.getItem('lfc_' + key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
        const merged = Object.assign({}, fallback, parsed);
        if (key === 'settings') {
          merged.adminPin = '5640';
          if (!merged.freeDeliveryAbove || merged.freeDeliveryAbove === 2000 || merged.freeDeliveryAbove === 1500) {
            merged.freeDeliveryAbove = 1000;
          }
        }
        return merged;
      }
      if (key === 'menu_items' && Array.isArray(parsed)) {
        return parsed.map((item, idx) => {
          let img = item.image || './images/hero-1.jpg';
          if (!img || img.includes('src/assets') || img.includes('regenerated')) {
            img = item.cat === 'pizzas' ? './images/hero-3.jpg' : item.cat === 'rolls' ? './images/hero-2.jpg' : item.cat === 'buckets' ? './images/hero-4.jpg' : './images/hero-1.jpg';
          }
          return {
            ...item,
            image: img
          };
        });
      }
      if (key === 'hero_slides' && Array.isArray(parsed)) {
        return parsed.map((s, idx) => ({
          ...s,
          image: s.image && !s.image.includes('src/assets') ? s.image : (idx === 1 ? './images/hero-2.jpg' : idx === 2 ? './images/hero-3.jpg' : idx === 3 ? './images/hero-4.jpg' : './images/hero-1.jpg')
        }));
      }
      if (key === 'branches' && Array.isArray(parsed)) {
        const oldDefaults = ['Gulberg III (Main MM Alam)', 'DHA Phase 5 Commercial', 'Johar Town (G1 Market)', 'Mall Road Heritage'];
        if (parsed.length === oldDefaults.length && parsed.every((branch) => oldDefaults.includes(branch.name))) {
          localStorage.setItem('lfc_branches', JSON.stringify(fallback));
          return fallback;
        }
      }
      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  function saveData(key, val) {
    try {
      localStorage.setItem('lfc_' + key, JSON.stringify(val));
      if (!applyingRemote && !selfSaving && SYNC_KEYS.includes(key)) syncSoon();
      return true;
    } catch (e) {
      console.warn('LocalStorage save error', e);
      if (typeof showToast === 'function') showToast('⚠️ Could not save: browser storage is full. Use a smaller photo.');
      return false;
    }
  }

  // --- App State ---
  let settings = loadData('settings', DEFAULT_SETTINGS);
  const MENU_VERSION = '2026-10-17-v2';
  let menuWasReset = false;
  try {
    if (localStorage.getItem('lfc_menu_version') !== MENU_VERSION) {
      localStorage.removeItem('lfc_menu_items'); localStorage.removeItem('lfc_categories');
      localStorage.setItem('lfc_menu_version', MENU_VERSION); menuWasReset = true;
    }
  } catch (e) {}
  let categories = loadData('categories', DEFAULT_CATEGORIES);
  let heroSlides = loadData('hero_slides', DEFAULT_HERO_SLIDES);
  let heroConfig = loadData('hero_config', { autoplay: true, interval: 6, showThumbs: true, showPrice: true });
  if (menuWasReset) { heroSlides.forEach((s, i) => { const d = DEFAULT_HERO_SLIDES[i]; if (d) { s.targetDealId = d.targetDealId; s.priceTag = d.priceTag; } }); saveData('hero_slides', heroSlides); }
  function activeSlides() { const a = heroSlides.filter((s) => s.enabled !== false); return a.length ? a : heroSlides; }
  let menuItems = loadData('menu_items', DEFAULT_MENU_ITEMS);
  let branches = loadData('branches', DEFAULT_BRANCHES);
  let reviews = loadData('reviews', DEFAULT_REVIEWS);
  let zones = loadData('zones', DEFAULT_ZONES);
  let promos = loadData('promos', DEFAULT_PROMOS);
  let orders = loadData('orders', DEFAULT_ORDERS);
  let cart = loadData('cart', []);
  let orderType = loadData('order_type', 'delivery'); // 'delivery' | 'pickup' | 'dinein'

  let activeCategory = 'all';
  let searchQuery = '';
  let activeSlideIndex = 0;
  let heroSlideTimer = null;
  let tickerTimer = null;
  let tickerIndex = 0;
  let appliedPromo = null;
  let isAdminAuthenticated = false;
  let activeOrderFilter = 'all';

  // --- Theme State & Color Palettes ---
  const THEMES = [
    { id: 'flame', name: 'Spicy Flame' },
    { id: 'gold', name: 'Golden Honey' },
    { id: 'sunset', name: 'Sunset Royale' }
  ];
  let currentTheme = 'flame';
  try {
    const savedTheme = localStorage.getItem('lfc_theme');
    if (savedTheme && ['flame', 'gold', 'sunset'].includes(savedTheme)) {
      currentTheme = savedTheme;
    }
  } catch (e) {}

  function setTheme(themeId) {
    currentTheme = themeId;
    document.body.classList.remove('theme-flame', 'theme-gold', 'theme-sunset');
    document.body.classList.add('theme-' + themeId);
    try {
      localStorage.setItem('lfc_theme', themeId);
    } catch (e) {}
    const label = document.getElementById('theme-btn-label');
    const matched = THEMES.find((t) => t.id === themeId);
    if (label && matched) {
      label.textContent = matched.name;
    }
  }

  function cycleTheme() {
    const idx = THEMES.findIndex((t) => t.id === currentTheme);
    const nextIdx = (idx + 1) % THEMES.length;
    const target = THEMES[nextIdx];
    setTheme(target.id);
    showToast(`Color Theme: ${target.name}`);
  }

  // --- Multi-Options Modal State ---
  let currentCustomizingItem = null;
  let customSelectedSize = null;
  let customSelectedSpice = null;
  let customSelectedAddons = [];
  let customQty = 1;

  // --- Toast Notification ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-black transition-all duration-300 transform translate-y-3 opacity-0 backdrop-blur-md border ${
      isError
        ? 'bg-red-600/95 text-white border-red-400'
        : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 text-black border-amber-300 shadow-amber-500/20'
    }`;
    toast.innerHTML = `
      <span class="text-base">${isError ? '⚠️' : '🍗'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-3');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Cart Mathematics ---
  function getCartSubtotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function getCurrentDeliveryZone() {
    const zoneId = settings.selectedZoneId || 'gulberg';
    return zones.find((z) => z.id === zoneId) || zones[0] || { fee: settings.deliveryFee || 150, time: '25-35 mins' };
  }

  function getDeliveryFee() {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    if (orderType !== 'delivery') return 0;
    if (subtotal >= (settings.freeDeliveryAbove || 1000)) return 0;
    const zone = getCurrentDeliveryZone();
    return Number(zone.fee) || Number(settings.deliveryFee) || 150;
  }

  function getDiscountAmount() {
    if (!appliedPromo) return 0;
    const subtotal = getCartSubtotal();
    if (appliedPromo.minOrder && subtotal < appliedPromo.minOrder) return 0;
    if (appliedPromo.type === 'percent') {
      return Math.round((subtotal * appliedPromo.discount) / 100);
    }
    return Number(appliedPromo.discount) || 0;
  }

  function getGrandTotal() {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    const fee = getDeliveryFee();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal + fee - discount);
  }

  // --- Multi-Options Modal Logic ---
  function openCustomizeModal(itemId) {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    currentCustomizingItem = item;
    customQty = 1;

    // Default sizes
    const sizes = item.sizes && item.sizes.length ? item.sizes : [{ name: 'Regular Portion', price: 0 }];
    customSelectedSize = sizes[0];

    // Default spice
    const spices = item.spiceLevels && item.spiceLevels.length ? item.spiceLevels : ['Mild Crunchy', 'Hot Spicy Lahori', 'Ghost Fire 🔥'];
    customSelectedSpice = spices[0];

    // Default addons
    customSelectedAddons = [];

    // Populate Modal UI
    const modal = document.getElementById('item-customize-modal');
    const modalImg = document.getElementById('cust-modal-img');
    const modalTitle = document.getElementById('cust-modal-title');
    const modalDesc = document.getElementById('cust-modal-desc');
    const modalBadge = document.getElementById('cust-modal-badge');
    const notesInput = document.getElementById('cust-special-notes');

    if (modalImg) {
      modalImg.src = item.image;
      modalImg.onerror = () => {
        modalImg.onerror = null;
        modalImg.src = './images/hero-1.jpg';
      };
    }
    if (modalTitle) modalTitle.textContent = item.name;
    if (modalDesc) modalDesc.textContent = item.desc;
    if (modalBadge) {
      modalBadge.textContent = item.badge || 'Fresh & Hot';
      modalBadge.classList.toggle('hidden', !item.badge);
    }
    if (notesInput) notesInput.value = '';

    renderCustomizeOptions();
    updateCustomizeModalTotal();

    if (modal) modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeCustomizeModal() {
    const modal = document.getElementById('item-customize-modal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function renderCustomizeOptions() {
    if (!currentCustomizingItem) return;
    const item = currentCustomizingItem;

    // 1. Sizes
    const sizesContainer = document.getElementById('cust-sizes-list');
    const sizes = item.sizes && item.sizes.length ? item.sizes : [{ name: 'Regular Portion', price: 0 }];
    if (sizesContainer) {
      sizesContainer.innerHTML = sizes
        .map((s, idx) => {
          const isSelected = customSelectedSize && customSelectedSize.name === s.name;
          return `
          <button type="button" onclick="window.LFC.selectCustomizeSize(${idx})" class="p-3 rounded-2xl border text-left transition flex items-center justify-between ${
            isSelected
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20'
              : 'bg-[#141824] border-gray-800 text-gray-300 hover:border-gray-700'
          }">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                isSelected ? 'border-amber-400 bg-amber-500 text-black' : 'border-gray-600'
              }">
                ${isSelected ? '✓' : ''}
              </span>
              <span class="text-xs font-bold">${s.name}</span>
            </div>
            <span class="text-xs font-black ${isSelected ? 'text-amber-400' : 'text-gray-400'}">
              ${s.price === 0 ? 'Standard' : `+Rs. ${s.price}`}
            </span>
          </button>
        `;
        })
        .join('');
    }

    // 2. Spice Levels
    const spiceContainer = document.getElementById('cust-spice-list');
    const spices = item.spiceLevels && item.spiceLevels.length ? item.spiceLevels : ['Mild Crunchy', 'Hot Spicy Lahori', 'Ghost Fire 🔥'];
    if (spiceContainer) {
      spiceContainer.innerHTML = spices
        .map((sp) => {
          const isSelected = customSelectedSpice === sp;
          return `
          <button type="button" onclick="window.LFC.selectCustomizeSpice('${sp}')" class="px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
            isSelected
              ? 'bg-gradient-to-r from-red-600 to-amber-600 border-red-400 text-white shadow-md'
              : 'bg-[#141824] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
          }">
            ${sp}
          </button>
        `;
        })
        .join('');
    }

    // 3. Add-ons
    const addonsContainer = document.getElementById('cust-addons-list');
    const addons = item.addons && item.addons.length ? item.addons : [
      { name: 'Extra Garlic Mayo Dip', price: 60 },
      { name: 'Melted Cheddar Slice', price: 80 }
    ];
    if (addonsContainer) {
      addonsContainer.innerHTML = addons
        .map((a, idx) => {
          const isSelected = customSelectedAddons.some((ca) => ca.name === a.name);
          return `
          <button type="button" onclick="window.LFC.toggleCustomizeAddon(${idx})" class="w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
            isSelected
              ? 'bg-emerald-500/15 border-emerald-400/60 text-white'
              : 'bg-[#141824] border-gray-800 text-gray-300 hover:border-gray-700'
          }">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded border flex items-center justify-center ${
                isSelected ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-gray-600'
              }">
                ${isSelected ? '✓' : ''}
              </span>
              <span class="text-xs font-semibold">${a.name}</span>
            </div>
            <span class="text-xs font-black text-emerald-400">+Rs. ${a.price}</span>
          </button>
        `;
        })
        .join('');
    }
  }

  function selectCustomizeSize(idx) {
    if (!currentCustomizingItem) return;
    const sizes = currentCustomizingItem.sizes && currentCustomizingItem.sizes.length
      ? currentCustomizingItem.sizes
      : [{ name: 'Regular Portion', price: 0 }];
    customSelectedSize = sizes[idx] || sizes[0];
    renderCustomizeOptions();
    updateCustomizeModalTotal();
  }

  function selectCustomizeSpice(spice) {
    customSelectedSpice = spice;
    renderCustomizeOptions();
    updateCustomizeModalTotal();
  }

  function toggleCustomizeAddon(idx) {
    if (!currentCustomizingItem) return;
    const addons = currentCustomizingItem.addons && currentCustomizingItem.addons.length
      ? currentCustomizingItem.addons
      : [
          { name: 'Extra Garlic Mayo Dip', price: 60 },
          { name: 'Melted Cheddar Slice', price: 80 }
        ];
    const addon = addons[idx];
    if (!addon) return;

    const exists = customSelectedAddons.findIndex((a) => a.name === addon.name);
    if (exists >= 0) {
      customSelectedAddons.splice(exists, 1);
    } else {
      customSelectedAddons.push(addon);
    }
    renderCustomizeOptions();
    updateCustomizeModalTotal();
  }

  function stepCustomizeQty(delta) {
    customQty = Math.max(1, customQty + delta);
    const qtyEl = document.getElementById('cust-modal-qty');
    if (qtyEl) qtyEl.textContent = customQty;
    updateCustomizeModalTotal();
  }

  function updateCustomizeModalTotal() {
    if (!currentCustomizingItem) return;
    const base = Number(currentCustomizingItem.price) || 0;
    const sizeOffset = customSelectedSize ? Number(customSelectedSize.price) || 0 : 0;
    const addonsSum = customSelectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const unitPrice = base + sizeOffset + addonsSum;
    const total = unitPrice * customQty;

    const btnTotal = document.getElementById('cust-modal-total-btn');
    if (btnTotal) btnTotal.textContent = `Rs. ${total.toLocaleString()}`;
  }

  function confirmCustomizedItem() {
    if (!currentCustomizingItem) return;
    const item = currentCustomizingItem;
    const base = Number(item.price) || 0;
    const sizeOffset = customSelectedSize ? Number(customSelectedSize.price) || 0 : 0;
    const addonsSum = customSelectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const unitPrice = base + sizeOffset + addonsSum;

    const notesInput = document.getElementById('cust-special-notes');
    const specialNotes = notesInput ? notesInput.value.trim() : '';

    cart.push({
      id: `${item.id}_${Date.now()}`,
      menuId: item.id,
      name: item.name,
      basePrice: item.price,
      selectedSize: customSelectedSize ? { ...customSelectedSize } : { name: 'Regular', price: 0 },
      selectedSpice: customSelectedSpice || 'Regular',
      selectedAddons: [...customSelectedAddons],
      specialNotes: specialNotes,
      price: unitPrice,
      image: item.image,
      qty: customQty
    });

    saveData('cart', cart);
    updateCartUI();
    closeCustomizeModal();
    showToast(`Added ${item.name} (${customQty}x) to order!`);
    animateCartButton();
  }

  // --- Direct Quick Add to Cart (Default Options) ---
  function addToCart(item, qty = 1) {
    // Quick Add opens customizer so customer can enjoy multi-options!
    openCustomizeModal(item.id);
  }

  function addToCartById(id) {
    const item = menuItems.find((m) => m.id === id);
    if (item) openCustomizeModal(item.id);
  }

  function animateCartButton() {
    const btns = document.querySelectorAll('.cart-btn-trigger');
    btns.forEach((btn) => {
      btn.classList.add('scale-110');
      setTimeout(() => btn.classList.remove('scale-110'), 200);
    });
  }

  function updateCartItemQty(cartItemId, delta) {
    const item = cart.find((c) => String(c.id) === String(cartItemId));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((c) => String(c.id) !== String(cartItemId));
    }
    saveData('cart', cart);
    updateCartUI();
  }

  function removeCartItem(cartItemId) {
    cart = cart.filter((c) => String(c.id) !== String(cartItemId));
    saveData('cart', cart);
    updateCartUI();
    showToast('Item removed from order');
  }

  function clearCart() {
    cart = [];
    appliedPromo = null;
    saveData('cart', cart);
    updateCartUI();
  }

  // --- Delivery Zone Selector in Cart ---
  function changeDeliveryZone(zoneId) {
    settings.selectedZoneId = zoneId;
    saveData('settings', settings);
    updateCartUI();
    const zone = getCurrentDeliveryZone();
    showToast(`Delivery zone updated: ${zone.name}`);
  }

  function renderZoneSelect() {
    const select = document.getElementById('checkout-zone-select');
    if (!select) return;
    const currentId = settings.selectedZoneId || 'gulberg';
    select.innerHTML = zones
      .map(
        (z) =>
          `<option value="${z.id}" ${z.id === currentId ? 'selected' : ''}>${z.name} — Rs. ${z.fee} (${z.time})</option>`
      )
      .join('');
  }

  // --- Cart UI Sync ---
  function updateCartUI() {
    const count = getCartCount();
    const subtotal = getCartSubtotal();
    const delivery = getDeliveryFee();
    const discount = getDiscountAmount();
    const total = getGrandTotal();
    const zone = getCurrentDeliveryZone();

    const countBadges = document.querySelectorAll('.cart-count-badge');
    countBadges.forEach((b) => {
      b.textContent = count;
      b.classList.toggle('hidden', count === 0);
    });

    const subtotalBadges = document.querySelectorAll('.cart-subtotal-badge');
    subtotalBadges.forEach((s) => {
      s.textContent = `Rs. ${subtotal.toLocaleString()}`;
    });

    const emptyState = document.getElementById('cart-empty-state');
    const filledState = document.getElementById('cart-filled-state');
    const itemsList = document.getElementById('cart-items-list');

    if (count === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (filledState) filledState.classList.add('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      if (filledState) filledState.classList.remove('hidden');

      if (itemsList) {
        itemsList.innerHTML = cart
          .map((i) => {
            const sizeTag = i.selectedSize && i.selectedSize.name ? i.selectedSize.name : '';
            const spiceTag = i.selectedSpice ? i.selectedSpice : '';
            const addonsText =
              i.selectedAddons && i.selectedAddons.length
                ? '+ ' + i.selectedAddons.map((a) => a.name).join(', ')
                : '';
            const noteTag = i.specialNotes ? `Note: "${i.specialNotes}"` : '';

            return `
            <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:border-amber-400 transition">
              <img src="${i.image}" alt="${i.name}" loading="lazy" decoding="async" class="w-14 h-14 rounded-xl object-cover bg-amber-50 flex-shrink-0 border border-amber-200" onerror="this.onerror=null; this.src='./images/hero-1.jpg';"/>
              <div class="flex-1 min-w-0">
                <h4 class="font-black text-xs sm:text-sm text-gray-900 truncate font-heading">${i.name}</h4>
                <div class="text-[11px] text-amber-700 font-black mt-0.5">Rs. ${(i.price * i.qty).toLocaleString()}</div>
                
                <!-- Multi-Options Details -->
                <div class="mt-1 space-y-0.5 text-[10px]">
                  ${
                    sizeTag || spiceTag
                      ? `<div class="text-amber-800 font-bold flex items-center gap-1"><span>📏 ${sizeTag}</span> • <span>🌶️ ${spiceTag}</span></div>`
                      : ''
                  }
                  ${addonsText ? `<div class="text-emerald-700 font-medium">${addonsText}</div>` : ''}
                  ${noteTag ? `<div class="text-gray-500 italic">${noteTag}</div>` : ''}
                </div>
              </div>
              <div class="flex items-center bg-amber-50 rounded-xl border border-amber-200 p-1">
                <button onclick="window.LFC.updateCartItemQty('${i.id}', -1)" class="w-6 h-6 flex items-center justify-center rounded text-gray-700 hover:text-slate-950 hover:bg-amber-200 text-sm font-bold transition">−</button>
                <span class="w-6 text-center font-black text-xs text-slate-950">${i.qty}</span>
                <button onclick="window.LFC.updateCartItemQty('${i.id}', 1)" class="w-6 h-6 flex items-center justify-center rounded text-gray-700 hover:text-slate-950 hover:bg-amber-200 text-sm font-bold transition">+</button>
              </div>
              <button onclick="window.LFC.removeCartItem('${i.id}')" class="text-gray-400 hover:text-red-500 p-1 transition" title="Remove">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          `;
          })
          .join('');
      }

      const elSubtotal = document.getElementById('cart-drawer-subtotal');
      const elDelivery = document.getElementById('cart-drawer-delivery');
      const elDiscountRow = document.getElementById('cart-drawer-discount-row');
      const elDiscount = document.getElementById('cart-drawer-discount');
      const elTotal = document.getElementById('cart-drawer-total');
      const etaBadge = document.getElementById('zone-eta-badge');

      if (elSubtotal) elSubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
      const deliveryLabel = document.getElementById('cart-drawer-delivery-label');
      if (deliveryLabel) {
        deliveryLabel.textContent =
          orderType === 'delivery'
            ? `Delivery Fee (${zone.name})`
            : orderType === 'pickup'
            ? 'Pickup (No Fee)'
            : 'Dine-In Service';
      }
      if (elDelivery) {
        elDelivery.textContent = delivery === 0 ? 'FREE' : `Rs. ${delivery}`;
        elDelivery.className = delivery === 0 ? 'text-emerald-400 font-extrabold' : 'text-gray-300 font-bold';
      }
      if (etaBadge) {
        if (orderType === 'delivery') {
          etaBadge.classList.remove('hidden');
          etaBadge.textContent = `⏱️ ${zone.time}`;
        } else {
          etaBadge.classList.add('hidden');
        }
      }
      if (elDiscountRow && elDiscount) {
        if (discount > 0) {
          elDiscountRow.classList.remove('hidden');
          elDiscount.textContent = `- Rs. ${discount.toLocaleString()}`;
        } else {
          elDiscountRow.classList.add('hidden');
        }
      }
      if (elTotal) elTotal.textContent = `Rs. ${total.toLocaleString()}`;
    }

    renderZoneSelect();
    updateOrderTypeUI();
    updateFreeDeliveryUI();
  }

  // --- Order Type & Free Delivery UI ---
  function setOrderType(type) {
    orderType = ['delivery', 'pickup', 'dinein'].includes(type) ? type : 'delivery';
    saveData('order_type', orderType);
    updateOrderTypeUI();
    updateCartUI();

    const labels = { delivery: 'Delivery', pickup: 'Pickup', dinein: 'Dine-In' };
    showToast(`Order type set to ${labels[orderType]}`);
  }

  function updateOrderTypeUI() {
    const buttons = document.querySelectorAll('.order-type-btn');
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute('data-order-type') === orderType;
      btn.classList.toggle('active', isActive);
    });

    const deliveryBox = document.getElementById('free-delivery-box');
    const zoneContainer = document.getElementById('checkout-zone-container');
    if (deliveryBox) deliveryBox.classList.toggle('hidden', orderType !== 'delivery');
    if (zoneContainer) zoneContainer.classList.toggle('hidden', orderType !== 'delivery');
  }

  function updateFreeDeliveryUI() {
    const label = document.getElementById('free-delivery-label');
    const fill = document.getElementById('free-delivery-fill');
    if (!label || !fill) return;

    const subtotal = getCartSubtotal();
    const threshold = Number(settings.freeDeliveryAbove) || 2000;

    if (threshold <= 0) {
      label.textContent = 'Free delivery on every order! 🎉';
      label.className = 'text-emerald-400 font-black';
      fill.style.width = '100%';
      return;
    }

    if (subtotal >= threshold) {
      label.textContent = '🎉 You unlocked FREE delivery!';
      label.className = 'text-emerald-400 font-black';
      fill.style.width = '100%';
    } else {
      const remaining = threshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      label.textContent = `Add Rs. ${remaining.toLocaleString()} more for FREE delivery`;
      label.className = 'text-gray-300';
      fill.style.width = pct + '%';
    }
  }

  // --- Dynamic Logo, Contact & Store Status Sync ---
  function updateBrandLogos() {
    const logoImgs = document.querySelectorAll('.brand-logo-img');
    const safeLogo = settings && settings.logoUrl ? settings.logoUrl : './images/logo.png';
    if (safeLogo !== './images/logo.png') document.querySelectorAll('link[rel="icon"]').forEach((l) => { l.removeAttribute('sizes'); l.href = safeLogo; });
    logoImgs.forEach((img) => {
      img.src = safeLogo;
      img.onerror = () => {
        img.onerror = null;
        img.src = './images/logo.png';
      };
    });

    const safePhone = settings && settings.phoneCallNumber ? String(settings.phoneCallNumber) : '0322-4940181';
    const phoneLinks = document.querySelectorAll('.store-phone-link');
    phoneLinks.forEach((a) => {
      a.href = `tel:${safePhone.replace(/[^0-9]/g, '')}`;
      a.textContent = safePhone;
    });

    const safeWa = settings && settings.whatsappNumber ? String(settings.whatsappNumber) : '0322-4940181';
    const waLinks = document.querySelectorAll('.store-wa-link');
    waLinks.forEach((a) => {
      let num = safeWa.replace(/[^0-9]/g, '');
      if (num.startsWith('0')) num = '92' + num.substring(1);
      a.href = `https://wa.me/${num}?text=Hi%20LFC!%20I%20want%20to%20place%20an%20order.`;
    });

    // Sync Announcement Text
    const announcementEl = document.getElementById('live-order-ticker-text');
    if (settings.announcementText && announcementEl && !tickerTimer) {
      announcementEl.textContent = settings.announcementText;
    }
  }

  // --- Hero Section Renderer & Animations ---
  function renderHeroSlide(index) {
    const slidesList = activeSlides();
    if (!slidesList.length) return;
    activeSlideIndex = (index + slidesList.length) % slidesList.length;
    const slide = slidesList[activeSlideIndex];

    const titleEl = document.getElementById('hero-title');
    const highlightEl = document.getElementById('hero-highlight');
    const subtitleEl = document.getElementById('hero-subtitle');
    const badgeEl = document.getElementById('hero-badge');
    const priceEl = document.getElementById('hero-price');
    const ratingEl = document.getElementById('hero-rating');
    const imgEl = document.getElementById('hero-image');
    const ctaBtn = document.getElementById('hero-cta-btn');

    if (titleEl) titleEl.textContent = slide.title;
    if (highlightEl) highlightEl.textContent = slide.highlight;
    if (subtitleEl) subtitleEl.textContent = slide.subtitle;
    if (badgeEl) badgeEl.textContent = slide.badgeText;
    if (priceEl) priceEl.textContent = slide.priceTag;
    if (ratingEl) ratingEl.textContent = slide.rating || '4.9 ★ (1,500+ reviews)';
    const setT = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    setT('hero-price-label', slide.priceLabel || 'Combo Price');
    setT('hero-cta-text', slide.ctaText || 'Order Now');
    const oldP = document.getElementById('hero-old-price');
    if (oldP) { oldP.textContent = slide.oldPrice || ''; oldP.classList.toggle('hidden', !slide.oldPrice); }
    const pBox = document.getElementById('hero-price-box');
    if (pBox) pBox.style.display = heroConfig.showPrice === false || !slide.priceTag ? 'none' : '';
    const tWrap = document.getElementById('hero-thumbs-wrap');
    if (tWrap) tWrap.style.display = heroConfig.showThumbs === false || slidesList.length < 2 ? 'none' : '';

    if (ctaBtn) {
      ctaBtn.onclick = () => {
        let item = null;
        if (slide.targetDealId) {
          item = menuItems.find((m) => m.id === slide.targetDealId);
        }
        if (!item) {
          item = menuItems.find((m) => m.name.toLowerCase().includes(slide.highlight.toLowerCase())) || menuItems[0];
        }
        if (item) openCustomizeModal(item.id);
      };
    }

    if (imgEl) {
      // Preload first so the swap works even if the URL is unchanged or the image is large
      const token = (imgEl._swap = (imgEl._swap || 0) + 1);
      const next = slide.image;
      imgEl.style.opacity = '0.35';
      const pre = new Image();
      pre.onload = () => { if (imgEl._swap !== token) return; imgEl.src = next; imgEl.style.opacity = '1'; };
      pre.onerror = () => { if (imgEl._swap !== token) return; imgEl.src = './images/hero-1.jpg'; imgEl.style.opacity = '1'; };
      pre.src = next;
    }

    renderHeroThumbnails();
  }

  function renderHeroThumbnails() {
    const thumbsContainer = document.getElementById('hero-thumbnails');
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = activeSlides()
      .map(
        (s, idx) => `
        <button 
          onclick="window.LFC.goToHeroSlide(${idx})"
          class="relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl transition-all duration-300 text-left border cursor-pointer flex-shrink-0 ${
            idx === activeSlideIndex
              ? 'bg-amber-100/90 border-amber-400 shadow-md shadow-amber-500/20 scale-102 ring-1 ring-amber-400'
              : 'bg-white/90 border-amber-200/90 hover:border-amber-300 opacity-80 hover:opacity-100 shadow-xs'
          }">
          <img src="${s.image}" alt="" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0" onerror="this.src='./images/hero-1.jpg'"/>
          <div class="pr-1 sm:pr-2">
            <div class="text-[10px] sm:text-[11px] font-black text-gray-950 leading-tight truncate max-w-[85px] sm:max-w-[110px] font-heading">${s.highlight}</div>
            <div class="text-[9px] sm:text-[10px] text-amber-700 font-extrabold">${s.priceTag}</div>
          </div>
          ${
            idx === activeSlideIndex
              ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>'
              : ''
          }
        </button>
      `
      )
      .join('');
  }

  function startHeroTimer() {
    stopHeroTimer();
    if (heroConfig.autoplay === false || activeSlides().length < 2) return;
    heroSlideTimer = setInterval(() => {
      renderHeroSlide(activeSlideIndex + 1);
    }, Math.max(3, Number(heroConfig.interval) || 6) * 1000);
  }

  function stopHeroTimer() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
  }

  // --- Live Order Ticker ---
  function startLiveOrderTicker() {
    const tickerEl = document.getElementById('live-order-ticker-text');
    if (!tickerEl) return;

    tickerTimer = setInterval(() => {
      tickerIndex = (tickerIndex + 1) % PROMO_TICKERS.length;
      tickerEl.style.opacity = '0';
      tickerEl.style.transform = 'translateY(5px)';
      setTimeout(() => {
        tickerEl.textContent = PROMO_TICKERS[tickerIndex];
        tickerEl.style.opacity = '1';
        tickerEl.style.transform = 'translateY(0)';
      }, 300);
    }, 4500);
  }

  // --- Menu Categories & Grid Renderer ---
  function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = categories
      .map(
        (c) => `
        <button onclick="window.LFC.setCategory('${c.id}')" class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
          activeCategory === c.id
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/30 scale-105 border border-yellow-300'
            : 'bg-white text-gray-800 hover:text-amber-800 hover:border-amber-400 border border-amber-200/90 shadow-sm font-bold'
        }">
          ${c.name}
        </button>
      `
      )
      .join('');
  }

  function renderMenu() {
    const grid = document.getElementById('menu-grid');
    const empty = document.getElementById('menu-empty');
    if (!grid) return;

    let items = menuItems;
    if (activeCategory !== 'all') {
      items = items.filter((i) => i.cat === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    }

    updateSearchUI(items.length);

    if (items.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }

    if (empty) empty.classList.add('hidden');

    grid.innerHTML = items
      .map((item) => {
        const spicinessDots =
          item.spiciness > 0
            ? `<div class="hidden sm:flex items-center gap-1 text-[10px] text-amber-900 font-bold bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                <span>🌶️</span><span>${'🔥'.repeat(item.spiciness)}</span>
               </div>`
            : '';

        const badgeHtml = item.badge
          ? `<span class="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase px-2.5 py-0.5 rounded-lg shadow-md tracking-wider z-10 border border-yellow-300">
              ${item.badge}
             </span>`
          : '';

        const stockOverlay = !item.inStock
          ? `<div class="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center rounded-3xl z-20">
              <span class="bg-red-600 text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider">Sold Out</span>
             </div>`
          : '';

        const hasMultiOptions =
          (item.sizes && item.sizes.length > 1) || (item.addons && item.addons.length > 0);

        return `
          <div class="group relative bg-white rounded-[26px] border-2 border-amber-200/90 hover:border-amber-400 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.12)] hover:shadow-[0_20px_45px_-5px_rgba(245,158,11,0.25)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
            ${stockOverlay}
            
            <div class="relative aspect-[4/3] sm:h-52 overflow-hidden bg-amber-50 flex-shrink-0 cursor-pointer lfc-media" onclick="window.LFC.openCustomizeModal(${item.id})">
              ${badgeHtml}
              <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" class="w-full h-full object-cover transform group-hover:scale-108 transition-all duration-500" onerror="this.onerror=null; this.src='./images/hero-1.jpg';"/>
              <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-60"></div>
            </div>

            <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-1 mb-1.5">
                  <h3 onclick="window.LFC.openCustomizeModal(${item.id})" class="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-amber-600 transition leading-snug line-clamp-1 font-heading cursor-pointer">${item.name}</h3>
                  ${spicinessDots}
                </div>
                <p class="text-gray-600 text-[11px] sm:text-xs line-clamp-2 leading-relaxed mb-3">${item.desc}</p>
                
                ${
                  hasMultiOptions
                    ? `<div class="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-900 bg-amber-50 border border-amber-300/80 px-2.5 py-0.5 rounded-full mb-2.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Portions, Spiciness & Extras</span>
                       </div>`
                    : ''
                }
              </div>

              <div class="pt-3 border-t border-amber-100 flex items-center justify-between gap-2 mt-auto">
                <div>
                  <span class="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-wider block">From</span>
                  <div class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 font-black text-base sm:text-xl tracking-tight font-heading">Rs. ${item.price.toLocaleString()}</div>
                </div>

                <button 
                  onclick="window.LFC.openCustomizeModal(${item.id})"
                  ${!item.inStock ? 'disabled' : ''}
                  class="flex items-center gap-1.5 px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    item.inStock
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 shadow-md shadow-amber-400/30 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }">
                  <span class="text-sm font-bold">+</span>
                  <span>Order</span>
                </button>
              </div>
            </div>

          </div>
        `;
      })
      .join('');
  }

  // --- Search UI Helpers ---
  function updateSearchUI(resultCount) {
    const hasQuery = !!searchQuery.trim();

    ['search-clear-desktop', 'search-clear-mobile'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.toggle('hidden', !hasQuery);
    });

    const countEl = document.getElementById('menu-result-count');
    if (!countEl) return;
    const catName = (categories.find((c) => c.id === activeCategory) || {}).name || 'All Bites';
    if (hasQuery) {
      countEl.textContent = `${resultCount} result${resultCount === 1 ? '' : 's'} for "${searchQuery.trim()}" in ${catName}`;
    } else {
      countEl.textContent = `Showing ${resultCount} item${resultCount === 1 ? '' : 's'} in ${catName}`;
    }
  }

  function clearSearch() {
    searchQuery = '';
    ['menu-search-input', 'mobile-search-input'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    renderMenu();
    const focusEl = document.getElementById('menu-search-input') || document.getElementById('mobile-search-input');
    if (focusEl) focusEl.focus();
  }

  // --- Reviews Renderer ---
  function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    grid.innerHTML = reviews
      .map(
        (r) => `
        <div class="p-5 sm:p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex text-amber-500 text-xs sm:text-sm">
                ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
              </div>
              <span class="text-[11px] text-gray-500 font-medium">${r.date}</span>
            </div>
            <p class="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 italic">"${r.comment}"</p>
          </div>
          <div class="flex items-center gap-3 pt-3 border-t border-amber-100">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-xs sm:text-sm shadow-sm border border-amber-300">
              ${r.name.charAt(0)}
            </div>
            <div>
              <div class="font-bold text-xs sm:text-sm text-gray-900">${r.name}</div>
              <div class="text-[10px] sm:text-xs text-amber-800 flex items-center gap-1 font-medium">
                <span>📍 ${r.location}</span>
                <span class="text-gray-400">•</span>
                <span class="text-emerald-600 font-bold">Verified Lahori</span>
              </div>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  // --- Branches Renderer ---
  function renderBranches() {
    const grid = document.getElementById('branches-grid');
    if (!grid) return;

    grid.innerHTML = branches
      .map((b) => {
        const safeBranchPhone = b.phone ? String(b.phone) : '0322-4940181';
        const cleanBranchPhone = safeBranchPhone.replace(/[^0-9]/g, '');
        return `
        <div class="p-5 sm:p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-extrabold text-gray-900 text-sm sm:text-base font-heading">${b.name}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300">
                Open Now
              </span>
            </div>
            <p class="text-gray-600 text-xs leading-relaxed mb-4">${b.address}</p>
            <div class="space-y-1.5 text-xs text-gray-700 mb-5">
              <div class="flex items-center gap-2">
                <span class="text-amber-700 font-bold">🕒 Hours:</span>
                <span>${b.timings}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-700 font-bold">📞 Phone:</span>
                <a href="tel:${cleanBranchPhone}" class="text-amber-700 hover:text-amber-900 font-bold underline decoration-dotted">${safeBranchPhone}</a>
              </div>
            </div>
          </div>

          <div class="flex gap-2 pt-3 border-t border-amber-100">
            <a href="tel:${cleanBranchPhone}" class="flex-1 text-center py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition">
              Call Branch
            </a>
            <a href="${b.mapUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-bold text-xs shadow-sm transition">
              Directions ↗
            </a>
          </div>
        </div>
      `;
      })
      .join('');
  }

  // --- Cart Drawer Animations ---
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer || !backdrop) return;

    backdrop.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      drawer.classList.remove('translate-x-full');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer || !backdrop) return;

    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }

  // --- Promo Code Application ---
  function applyPromoCode(code) {
    const cleaned = (code || '').trim().toUpperCase();
    if (!cleaned) {
      showToast('Please enter a coupon code', 'error');
      return;
    }

    const subtotal = getCartSubtotal();
    const found = promos.find((p) => p.code.toUpperCase() === cleaned && p.active);

    if (!found) {
      showToast('Invalid or expired coupon code', 'error');
      return;
    }

    if (found.minOrder && subtotal < found.minOrder) {
      showToast(`Coupon requires minimum order of Rs. ${found.minOrder}`, 'error');
      return;
    }

    appliedPromo = found;
    const discount = getDiscountAmount();
    showToast(`Coupon ${found.code} applied! Saved Rs. ${discount.toLocaleString()}`);
    updateCartUI();
  }

  // --- WhatsApp Checkout & Order Recording ---
  function checkoutViaWhatsApp() {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const addressInput = document.getElementById('checkout-address');
    const notesInput = document.getElementById('checkout-notes');

    const customerName = nameInput ? nameInput.value.trim() : '';
    const customerPhone = phoneInput ? phoneInput.value.trim() : '';
    const customerAddress = addressInput ? addressInput.value.trim() : '';
    const specialNotes = notesInput ? notesInput.value.trim() : '';

    if (!customerName || !customerPhone || !customerAddress) {
      showToast('Please fill in Name, Phone, and Delivery Address', 'error');
      return;
    }

    const zone = getCurrentDeliveryZone();
    const subtotal = getCartSubtotal();
    const delivery = getDeliveryFee();
    const discount = getDiscountAmount();
    const total = getGrandTotal();

    const orderId = 'LFC-' + Math.floor(1000 + Math.random() * 9000);

    // Save order into persistent live orders system
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
      timestamp: Date.now(),
      customerName,
      customerPhone,
      customerAddress,
      orderType,
      deliveryZone: zone.name,
      specialNotes,
      items: JSON.parse(JSON.stringify(cart)),
      subtotal,
      deliveryFee: delivery,
      discount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      total,
      status: 'new'
    };

    orders.unshift(newOrder);
    saveData('orders', orders);

    // Build rich formatted WhatsApp message
    let msg = `🍗 *NEW ORDER: ${orderId} - ${settings.storeName.toUpperCase()}* 🍗\n`;
    msg += `-----------------------------------------\n`;
    msg += `👤 *Customer:* ${customerName}\n`;
    msg += `📞 *Phone:* ${customerPhone}\n`;
    msg += `🧾 *Order Type:* ${
      orderType === 'delivery' ? '🛵 Home Delivery' : orderType === 'pickup' ? '🥡 Pickup' : '🍽️ Dine-In'
    }\n`;
    if (orderType === 'delivery') {
      msg += `📍 *Delivery Area:* ${zone.name} (${zone.time})\n`;
      msg += `🏠 *Address:* ${customerAddress}\n`;
    }
    if (specialNotes) {
      msg += `📝 *Notes:* ${specialNotes}\n`;
    }
    msg += `-----------------------------------------\n`;
    msg += `📋 *ORDER SPECIFICATIONS:*\n`;

    cart.forEach((i, idx) => {
      msg += `${idx + 1}. *${i.qty}x ${i.name}* - Rs. ${(i.price * i.qty).toLocaleString()}\n`;
      if (i.selectedSize && i.selectedSize.name) {
        msg += `   └ Portion: ${i.selectedSize.name}\n`;
      }
      if (i.selectedSpice) {
        msg += `   └ Spice: ${i.selectedSpice}\n`;
      }
      if (i.selectedAddons && i.selectedAddons.length) {
        msg += `   └ Extras: ${i.selectedAddons.map((a) => a.name).join(', ')}\n`;
      }
      if (i.specialNotes) {
        msg += `   └ Custom note: "${i.specialNotes}"\n`;
      }
    });

    msg += `-----------------------------------------\n`;
    msg += `💰 Subtotal: Rs. ${subtotal.toLocaleString()}\n`;
    msg += `🚚 Delivery: ${delivery === 0 ? 'FREE' : 'Rs. ' + delivery}\n`;
    if (discount > 0) {
      msg += `🏷️ Discount (${appliedPromo.code}): -Rs. ${discount}\n`;
    }
    msg += `💵 *TOTAL PAYABLE: Rs. ${total.toLocaleString()}*\n`;
    msg += `-----------------------------------------\n`;
    msg += `Please confirm my order and send estimated delivery updates!`;

    const safeCheckoutWa = settings && settings.whatsappNumber ? String(settings.whatsappNumber) : '0322-4940181';
    let rawPhone = safeCheckoutWa.replace(/[^0-9]/g, '');
    if (rawPhone.startsWith('0')) {
      rawPhone = '92' + rawPhone.substring(1);
    }

    const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    showToast(`Order #${orderId} generated! Opening WhatsApp...`);
  }

  // --- Admin Suite Controls ---
  function renderAdminDashboard() {
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const totalRev = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing' || o.status === 'delivery').length;

    const elRev = document.getElementById('admin-stat-revenue');
    const elOrders = document.getElementById('admin-stat-orders');
    const elPending = document.getElementById('admin-stat-pending');
    const elMenu = document.getElementById('admin-stat-menu');
    const elCoupons = document.getElementById('admin-stat-coupons');
    const elZones = document.getElementById('admin-stat-zones');
    const elStatus = document.getElementById('admin-stat-status');
    const ordersBadge = document.getElementById('admin-orders-badge');

    if (elRev) elRev.textContent = `Rs. ${totalRev.toLocaleString()}`;
    if (elOrders) elOrders.textContent = orders.length;
    if (elPending) elPending.textContent = `${pendingCount} Active`;
    if (elMenu) elMenu.textContent = menuItems.length;
    if (elCoupons) elCoupons.textContent = promos.filter((p) => p.active).length;
    if (elZones) elZones.textContent = zones.length;
    if (ordersBadge) {
      ordersBadge.textContent = pendingCount;
      ordersBadge.classList.toggle('hidden', pendingCount === 0);
    }
    if (elStatus) {
      const st = settings.storeStatus || 'open';
      elStatus.textContent = st === 'open' ? 'OPEN' : st === 'busy' ? 'BUSY' : 'CLOSED';
      elStatus.className = st === 'open' ? 'text-emerald-400' : st === 'busy' ? 'text-amber-400' : 'text-red-400';
    }
  }

  function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const pinSection = document.getElementById('admin-pin-section');
    const panelSection = document.getElementById('admin-panel-section');

    if (isAdminAuthenticated) {
      renderAdminDashboard();
      if (pinSection) pinSection.classList.add('hidden');
      if (panelSection) panelSection.classList.remove('hidden');
      renderAdminOrders();
      renderAdminMenuItems();
      renderAdminCoupons();
      renderAdminZones();
      renderAdminCategories();
      renderAdminHeroSlides();
      renderAdminBranches();
      renderAdminSettings();
    } else {
      if (pinSection) pinSection.classList.remove('hidden');
      if (panelSection) panelSection.classList.add('hidden');
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  }

  function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.add('hidden');

    const h = (window.location.hash || '').toLowerCase();
    if (h.includes('admin') || h.includes('5640')) {
      try {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      } catch (e) {
        window.location.hash = '';
      }
    }
  }

  function submitAdminPin() {
    const pinInput = document.getElementById('admin-pin-input');
    if (!pinInput) return;

    const entered = pinInput.value.trim();
    const targetPin = settings && settings.adminPin ? String(settings.adminPin) : '5640';

    if (entered === targetPin || entered === '5640') {
      isAdminAuthenticated = true;
      showToast('Admin Access Granted');
      openAdminModal();
    } else {
      showToast('Access Denied: Incorrect Security PIN', 'error');
    }
  }

  function changeAdminPin() {
    const currentPinEl = document.getElementById('change-pin-current');
    const newPinEl = document.getElementById('change-pin-new');
    const confirmPinEl = document.getElementById('change-pin-confirm');

    const currentEntered = currentPinEl ? currentPinEl.value.trim() : '';
    const newPin = newPinEl ? newPinEl.value.trim() : '';
    const confirmPin = confirmPinEl ? confirmPinEl.value.trim() : '';

    const actualPin = settings && settings.adminPin ? String(settings.adminPin) : '5640';
    if (currentEntered !== actualPin && currentEntered !== '5640') {
      showToast('Current PIN is incorrect', 'error');
      return;
    }

    if (!newPin || newPin.length < 4) {
      showToast('New PIN must be at least 4 digits', 'error');
      return;
    }

    if (newPin !== confirmPin) {
      showToast('New PIN and Confirm PIN do not match', 'error');
      return;
    }

    settings.adminPin = newPin;
    saveData('settings', settings);

    if (currentPinEl) currentPinEl.value = '';
    if (newPinEl) newPinEl.value = '';
    if (confirmPinEl) confirmPinEl.value = '';

    showToast('Admin PIN changed successfully!');
  }


  /* ============ Shared save: Netlify Function + Blobs ============ */
  const IMG_RE = /^data:image\/(jpeg|png|webp);base64,/;
  const adminKey = () => { try { return localStorage.getItem('lfc_admin_key') || ''; } catch (e) { return ''; } };
  function setSyncStatus(t) {
    window.__lfcSync = t;
    const e = document.getElementById('sync-state'); if (e) e.textContent = t;
  }
  async function apiPost(body) {
    const r = await fetch('/api/site', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey() }, body: JSON.stringify(body) });
    let j = {}; try { j = await r.json(); } catch (e) {}
    if (!r.ok) throw new Error(j.error || (r.status === 404 ? 'Backend not found — deploy with Netlify Functions (see DEPLOY-NETLIFY.md)' : r.status === 401 ? 'Wrong admin key' : 'Server error ' + r.status));
    return j;
  }
  function syncSoon() {
    if (!adminKey()) return;
    if (syncing) { syncPending = true; return; }
    clearTimeout(syncTimer); syncTimer = setTimeout(() => syncUp(false), 2000);
  }
  async function syncUp(manual) {
    if (!adminKey()) { if (manual) showToast('Enter your admin key first'); return; }
    if (syncing) { syncPending = true; return; }
    syncing = true; setSyncStatus('⏳ Syncing…');
    try {
      const up = async (o) => { if (o && IMG_RE.test(o.image || '')) o.image = (await apiPost({ action: 'upload', dataUri: o.image })).url; };
      for (const s of heroSlides) await up(s);
      for (const m of menuItems) await up(m);
      if (IMG_RE.test(settings.logoUrl || '')) settings.logoUrl = (await apiPost({ action: 'upload', dataUri: settings.logoUrl })).url;
      selfSaving = true;
      saveData('hero_slides', heroSlides); saveData('menu_items', menuItems); saveData('settings', settings);
      selfSaving = false;
      const updatedAt = Date.now();
      const slim = menuItems.map((m) => ({ ...m, image: m.image && m.image.startsWith('data:image/svg') ? '' : m.image }));
      await apiPost({ action: 'save', data: { updatedAt, heroSlides, heroConfig, categories, menuItems: slim, logoUrl: settings.logoUrl, branches } });
      localStorage.setItem('lfc_remote_stamp', String(updatedAt));
      setSyncStatus('✅ Synced to all devices · ' + new Date().toLocaleTimeString());
      if (manual) showToast('Synced to all devices!');
    } catch (e) {
      selfSaving = false;
      setSyncStatus('❌ ' + e.message);
      showToast('Publish failed: ' + e.message, 'error');
    }
    syncing = false;
    if (syncPending) { syncPending = false; syncSoon(); }
  }
  async function publishAll() {
    const k = (document.getElementById('sync-key') || {}).value;
    if (k && k.trim()) localStorage.setItem('lfc_admin_key', k.trim());
    await syncUp(true);
  }
  async function syncRemoteData() {
    if (remoteSyncing || document.visibilityState === 'hidden') return;
    remoteSyncing = true;
    try {
      const r = await fetch('/api/site?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) {
        if (r.status !== 404) console.warn('Shared site data could not be loaded:', r.status);
        return;
      }
      const d = await r.json();
      if (!d || !d.updatedAt || localStorage.getItem('lfc_remote_stamp') === String(d.updatedAt)) return;
      applyingRemote = true;
      if (Array.isArray(d.heroSlides)) { heroSlides = d.heroSlides; saveData('hero_slides', heroSlides); }
      if (d.heroConfig) { heroConfig = d.heroConfig; saveData('hero_config', heroConfig); }
      if (Array.isArray(d.categories)) { categories = d.categories; saveData('categories', categories); }
      if (Array.isArray(d.branches)) { branches = d.branches; saveData('branches', branches); }
      if (Array.isArray(d.menuItems)) {
        menuItems = d.menuItems.map((m) => (!m.image || m.image.startsWith('data:image/svg') ? { ...m, image: menuArt(m.art || '🍽️') } : m));
        saveData('menu_items', menuItems);
      }
      if (d.logoUrl) { settings.logoUrl = d.logoUrl; saveData('settings', settings); }
      applyingRemote = false;
      try { localStorage.setItem('lfc_menu_version', MENU_VERSION); localStorage.setItem('lfc_remote_stamp', String(d.updatedAt)); } catch (e) {}
      activeCategory = 'all';
      updateBrandLogos(); renderHeroSlide(0); startHeroTimer(); renderCategories(); renderMenu(); renderBranches();
    } catch (e) {
      applyingRemote = false;
      console.warn('Shared site sync failed:', e);
    } finally {
      remoteSyncing = false;
    }
  }
  async function renderPublishTab() {
    const k = document.getElementById('sync-key'); if (k) k.value = adminKey();
    setSyncStatus(window.__lfcSync || (adminKey() ? 'Ready — changes sync automatically' : 'Enter your admin key to start'));
    const c = document.getElementById('sync-backend');
    if (c) {
      c.textContent = 'Checking backend…';
      try { const r = await fetch('/api/site?t=' + Date.now(), { cache: 'no-store' }); c.textContent = r.ok ? '✅ Backend connected' : '❌ Backend not found (deploy with Netlify Functions)'; }
      catch (e) { c.textContent = '❌ Backend not reachable'; }
    }
  }
  function refreshEditImage() {
    const h = document.getElementById('edit-item-image'), p = document.getElementById('edit-item-preview'), u = document.getElementById('edit-item-url');
    if (p && h) p.src = h.value;
    if (u && h) u.value = h.value.startsWith('data:') ? '' : h.value;
  }
  function editItemPhoto(input) {
    const itemId = Number((document.getElementById('edit-item-id') || {}).value);
    handlePhotoUpload(input, '', (b64) => {
      const imageField = document.getElementById('edit-item-image');
      if (!adminKey()) {
        if (imageField) imageField.value = b64;
        refreshEditImage();
        showToast('Photo selected. Enter your publishing key, then click Save Changes.', 'error');
        return false;
      }

      setSyncStatus('⏳ Uploading menu photo to shared storage…');
      apiPost({ action: 'upload', dataUri: b64 })
        .then((result) => {
          const currentId = Number((document.getElementById('edit-item-id') || {}).value);
          if (!result.url) throw new Error('Image upload returned no URL');
          if (currentId !== itemId || !imageField) {
            throw new Error('Photo uploaded, but the menu editor changed. Reopen this item and upload the photo again.');
          }
          imageField.value = result.url;
          refreshEditImage();
          setSyncStatus('✅ Photo uploaded. Click Save Changes to apply it to this menu item.');
          showToast('Photo uploaded to shared storage. Click Save Changes.');
        })
        .catch((error) => {
          setSyncStatus('❌ Photo upload failed: ' + error.message);
          showToast('Photo upload failed: ' + error.message, 'error');
        });
      return false;
    }, { maxDim: 900, quality: 0.82 });
  }
  function editItemUseArt() {
    const it = menuItems.find((m) => m.id === Number((document.getElementById('edit-item-id') || {}).value));
    document.getElementById('edit-item-image').value = menuArt((it && it.art) || '🍽️'); refreshEditImage();
  }
  function editItemUrl(v) { v = (v || '').trim(); if (v) { document.getElementById('edit-item-image').value = v; refreshEditImage(); } }

  function switchAdminTab(tabName) {
    const tabs = ['dashboard', 'orders', 'pos', 'analytics', 'menu', 'coupons', 'zones', 'categories', 'hero', 'branches', 'branding', 'publish', 'settings'];
    renderAdminDashboard();
    tabs.forEach((t) => {
      const btn = document.getElementById(`tab-btn-${t}`);
      const panel = document.getElementById(`tab-panel-${t}`);
      if (btn && panel) {
        if (t === tabName) {
          btn.className =
            'px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 text-black shadow-md flex-shrink-0 flex items-center gap-1.5';
          panel.classList.remove('hidden');
        } else {
          btn.className =
            'px-3 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-800 transition flex-shrink-0 flex items-center gap-1.5';
          panel.classList.add('hidden');
        }
      }
    });

    if (tabName === 'orders') renderAdminOrders();
    if (tabName === 'pos') initPosTerminal();
    if (tabName === 'analytics') renderAdminAnalytics();
    if (tabName === 'menu') renderAdminMenuItems();
    if (tabName === 'publish') renderPublishTab();
    if (tabName === 'coupons') renderAdminCoupons();
    if (tabName === 'zones') renderAdminZones();
  }

  // --- POS Quick Order Terminal Functions ---
  let posSelectedItem = null;
  let posSelectedSize = null;
  let posSelectedSpice = null;
  let posSelectedAddons = [];

  function initPosTerminal() {
    const select = document.getElementById('pos-item-select');
    if (!select) return;
    select.innerHTML = menuItems
      .filter((m) => m.inStock)
      .map((m) => `<option value="${m.id}">${m.name} (Base Rs. ${m.price.toLocaleString()})</option>`)
      .join('');
    if (menuItems.length > 0) {
      onPosDishSelect(menuItems[0].id);
    }
  }

  function onPosDishSelect(dishId) {
    const item = menuItems.find((m) => m.id === Number(dishId));
    if (!item) return;
    posSelectedItem = item;

    const sizes = item.sizes && item.sizes.length ? item.sizes : [{ name: 'Regular Portion', price: 0 }];
    posSelectedSize = sizes[0];

    const spices = item.spiceLevels && item.spiceLevels.length ? item.spiceLevels : ['Mild Crunchy', 'Hot Spicy Lahori', 'Ghost Fire 🔥'];
    posSelectedSpice = spices[0];

    posSelectedAddons = [];

    const baseBadge = document.getElementById('pos-base-price-badge');
    if (baseBadge) baseBadge.textContent = `Base: Rs. ${item.price.toLocaleString()}`;

    // Render sizes list
    const sizesList = document.getElementById('pos-sizes-list');
    if (sizesList) {
      sizesList.innerHTML = sizes
        .map(
          (s, idx) => `
          <label class="flex items-center justify-between p-1.5 rounded bg-[#090c18] border border-gray-800 text-[11px] cursor-pointer">
            <span class="flex items-center gap-1.5 text-gray-200">
              <input type="radio" name="pos-size-choice" value="${idx}" ${idx === 0 ? 'checked' : ''} onchange="window.LFC.selectPosSize(${idx})"/>
              <span>${s.name}</span>
            </span>
            <span class="text-amber-400 font-bold">+Rs. ${s.price}</span>
          </label>
        `
        )
        .join('');
    }

    // Render spice list
    const spiceList = document.getElementById('pos-spice-list');
    if (spiceList) {
      spiceList.innerHTML = spices
        .map(
          (sp, idx) => `
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-[#090c18] border border-gray-800 text-[11px] cursor-pointer text-gray-200">
            <input type="radio" name="pos-spice-choice" value="${idx}" ${idx === 0 ? 'checked' : ''} onchange="window.LFC.selectPosSpice('${sp}')"/>
            <span>${sp}</span>
          </label>
        `
        )
        .join('');
    }

    // Render addons list
    const addonsList = document.getElementById('pos-addons-list');
    const addons = item.addons || [];
    if (addonsList) {
      addonsList.innerHTML = addons.length
        ? addons
            .map(
              (a, idx) => `
            <label class="flex items-center justify-between p-1.5 rounded bg-[#090c18] border border-gray-800 text-[11px] cursor-pointer">
              <span class="flex items-center gap-1.5 text-gray-200">
                <input type="checkbox" onchange="window.LFC.togglePosAddon(${idx}, this.checked)"/>
                <span>${a.name}</span>
              </span>
              <span class="text-emerald-400 font-bold">+Rs. ${a.price}</span>
            </label>
          `
            )
            .join('')
        : '<div class="text-[10px] text-gray-500">No extras for this dish</div>';
    }

    calcPosTotal();
  }

  function selectPosSize(idx) {
    if (posSelectedItem && posSelectedItem.sizes && posSelectedItem.sizes[idx]) {
      posSelectedSize = posSelectedItem.sizes[idx];
      calcPosTotal();
    }
  }

  function selectPosSpice(spice) {
    posSelectedSpice = spice;
  }

  function togglePosAddon(idx, isChecked) {
    if (!posSelectedItem || !posSelectedItem.addons || !posSelectedItem.addons[idx]) return;
    const addon = posSelectedItem.addons[idx];
    if (isChecked) {
      if (!posSelectedAddons.some((a) => a.name === addon.name)) {
        posSelectedAddons.push(addon);
      }
    } else {
      posSelectedAddons = posSelectedAddons.filter((a) => a.name !== addon.name);
    }
    calcPosTotal();
  }

  function calcPosTotal() {
    if (!posSelectedItem) return { unitPrice: 0, qty: 1, deliveryFee: 0, total: 0 };
    const qtyInput = document.getElementById('pos-item-qty');
    const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);

    const basePrice = posSelectedItem.price;
    const sizePrice = posSelectedSize ? Number(posSelectedSize.price) || 0 : 0;
    const addonsPrice = posSelectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const unitPrice = basePrice + sizePrice + addonsPrice;

    const orderTypeEl = document.getElementById('pos-order-type');
    const mode = orderTypeEl ? orderTypeEl.value : 'dinein';
    const deliveryFee = mode === 'delivery' ? (settings.deliveryFee || 150) : 0;

    const total = unitPrice * qty + deliveryFee;

    const totalDisplay = document.getElementById('pos-total-display');
    if (totalDisplay) totalDisplay.textContent = `Rs. ${total.toLocaleString()}`;

    return { unitPrice, qty, deliveryFee, total };
  }

  function createPosOrder(shouldPrint) {
    if (!posSelectedItem) {
      showToast('Please select a dish first', 'error');
      return;
    }

    const nameEl = document.getElementById('pos-customer-name');
    const phoneEl = document.getElementById('pos-customer-phone');
    const addressEl = document.getElementById('pos-customer-address');
    const notesEl = document.getElementById('pos-special-notes');
    const typeEl = document.getElementById('pos-order-type');

    const customerName = nameEl && nameEl.value.trim() ? nameEl.value.trim() : 'Walk-in Customer';
    const customerPhone = phoneEl && phoneEl.value.trim() ? phoneEl.value.trim() : '0300-0000000';
    const customerAddress = addressEl && addressEl.value.trim() ? addressEl.value.trim() : 'Counter Order';
    const specialNotes = notesEl ? notesEl.value.trim() : '';
    const mode = typeEl ? typeEl.value : 'dinein';

    const { unitPrice, qty, deliveryFee, total } = calcPosTotal();
    const orderId = 'POS-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
      timestamp: Date.now(),
      customerName,
      customerPhone,
      customerAddress,
      orderType: mode,
      deliveryZone: mode === 'delivery' ? 'Lahore Counter Delivery' : 'In-Store Counter',
      specialNotes: specialNotes ? `[POS] ${specialNotes}` : '[POS Counter Order]',
      items: [
        {
          id: posSelectedItem.id,
          name: posSelectedItem.name,
          price: unitPrice,
          qty,
          selectedSize: posSelectedSize,
          selectedSpice: posSelectedSpice,
          selectedAddons: [...posSelectedAddons],
          specialNotes
        }
      ],
      subtotal: unitPrice * qty,
      deliveryFee,
      discount: 0,
      promoCode: null,
      total,
      status: 'preparing'
    };

    orders.unshift(newOrder);
    saveData('orders', orders);

    renderAdminOrders();
    renderAdminDashboard();
    renderAdminAnalytics();

    showToast(`Order #${orderId} created successfully!`);

    if (shouldPrint) {
      openReceiptModal(orderId);
    }

    if (notesEl) notesEl.value = '';
  }

  // --- Sales & Revenue Analytics ---
  function renderAdminAnalytics() {
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const totalRev = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const completedCount = deliveredOrders.length;
    const aov = completedCount > 0 ? Math.round(totalRev / completedCount) : 0;
    const pendingCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing' || o.status === 'delivery').length;

    const elRev = document.getElementById('analytics-total-rev');
    const elOrders = document.getElementById('analytics-total-orders');
    const elPending = document.getElementById('analytics-pending-orders');
    const elAov = document.getElementById('analytics-aov');
    const elZones = document.getElementById('analytics-zones-count');

    if (elRev) elRev.textContent = `Rs. ${totalRev.toLocaleString()}`;
    if (elOrders) elOrders.textContent = orders.length;
    if (elPending) elPending.textContent = `${pendingCount} active / in progress`;
    if (elAov) elAov.textContent = `Rs. ${aov.toLocaleString()}`;
    if (elZones) elZones.textContent = `${zones.length} Zones`;

    const counts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + (item.qty || 1);
      });
    });

    const sortedDishes = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxQty = sortedDishes.length > 0 ? sortedDishes[0][1] : 1;

    const topListEl = document.getElementById('analytics-top-dishes');
    if (topListEl) {
      if (sortedDishes.length === 0) {
        topListEl.innerHTML = '<div class="text-xs text-gray-400 py-4 text-center">No order records yet. Process orders to view top sellers!</div>';
      } else {
        topListEl.innerHTML = sortedDishes
          .slice(0, 5)
          .map(([name, qty], idx) => {
            const pct = Math.round((qty / maxQty) * 100);
            return `
            <div class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-bold text-white flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold">#${idx + 1}</span>
                  <span>${name}</span>
                </span>
                <span class="text-amber-400 font-black">${qty} sold</span>
              </div>
              <div class="h-2 rounded-full bg-[#0a0d18] border border-gray-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
          })
          .join('');
      }
    }
  }

  // --- Customer Quick Contact Helpers ---
  function whatsappCustomer(orderId) {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord || !ord.customerPhone) return;
    let raw = ord.customerPhone.replace(/[^0-9]/g, '');
    if (raw.startsWith('0')) raw = '92' + raw.substring(1);
    const text = `Hi ${ord.customerName}! This is LFC Lahore updating you regarding your order #${ord.id}. Current Status: ${ord.status.toUpperCase()}. Total: Rs. ${(ord.total || 0).toLocaleString()}. Thank you for choosing LFC!`;
    window.open(`https://wa.me/${raw}?text=${encodeURIComponent(text)}`, '_blank');
  }

  function callCustomer(orderId) {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord || !ord.customerPhone) return;
    const raw = ord.customerPhone.replace(/[^0-9]/g, '');
    window.location.href = `tel:${raw}`;
  }

  // --- Photo Upload Helper ---
  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  function handlePhotoUpload(fileInput, targetPreviewId, callback, opts) {
    if (!fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const o = Object.assign({ maxDim: 900, quality: 0.8 }, opts || {});
    compressImage(file, o.maxDim, o.quality)
      .then((base64) => {
        if (targetPreviewId) {
          const preview = document.getElementById(targetPreviewId);
          if (preview) { preview.src = base64; preview.classList.remove('hidden'); }
        }
        const ok = callback(base64);
        if (ok !== false) showToast('Photo uploaded successfully!');
      })
      .catch(() => showToast('Could not read that image. Please use a JPG or PNG.'));
    fileInput.value = ''; // lets you pick the same file again
  }

  // --- Live Orders Management ---
  let adminOrdersSearchQuery = '';

  function searchAdminOrders(query) {
    adminOrdersSearchQuery = (query || '').toLowerCase().trim();
    renderAdminOrders();
  }

  function playOrderChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }

  function generateTestOrder() {
    const lahoreNames = ['Ali Raza', 'Fatima Zahra', 'Hamza Butt', 'Ayesha Malik', 'Bilal Tariq', 'Zainab Qureshi'];
    const lahoreZones = zones.length ? zones : DEFAULT_ZONES;
    const randomZone = lahoreZones[Math.floor(Math.random() * lahoreZones.length)];
    const randomName = lahoreNames[Math.floor(Math.random() * lahoreNames.length)];
    const randomPhone = `032${Math.floor(1000000 + Math.random() * 8999999)}`;
    const randomItem1 = menuItems[Math.floor(Math.random() * menuItems.length)] || menuItems[0];
    const randomItem2 = menuItems[Math.floor(Math.random() * menuItems.length)];

    const items = [
      {
        id: randomItem1.id,
        name: randomItem1.name,
        price: randomItem1.price,
        qty: 1 + Math.floor(Math.random() * 2),
        selectedSize: randomItem1.sizes && randomItem1.sizes[0] ? randomItem1.sizes[0] : null,
        selectedSpice: 'Hot Spicy Lahori',
        selectedAddons: []
      }
    ];

    if (randomItem2 && randomItem2.id !== randomItem1.id) {
      items.push({
        id: randomItem2.id,
        name: randomItem2.name,
        price: randomItem2.price,
        qty: 1,
        selectedSize: null,
        selectedSpice: 'Mild Crunchy',
        selectedAddons: []
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryFee = subtotal >= (settings.freeDeliveryAbove || 2000) ? 0 : (randomZone.fee || 150);
    const total = subtotal + deliveryFee;

    const newOrder = {
      id: `LFC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: randomName,
      customerPhone: randomPhone,
      customerAddress: `House #${Math.floor(10 + Math.random() * 90)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}, ${randomZone.name}`,
      deliveryZone: randomZone.name,
      orderType: 'delivery',
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: 0,
      total: total,
      status: 'new',
      specialNotes: 'Extra spicy please, keep dips fresh!'
    };

    orders.unshift(newOrder);
    saveData('orders', orders);
    playOrderChime();
    renderAdminOrders();
    renderAdminDashboard();
    showToast(`🔔 New Sample Order ${newOrder.id} generated!`);
  }

  function renderAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    if (!list) return;

    // Update filter count badges
    const countAll = document.getElementById('count-filter-all');
    const countNew = document.getElementById('count-filter-new');
    const countPrep = document.getElementById('count-filter-preparing');
    const countDeliv = document.getElementById('count-filter-delivery');
    const countDelivered = document.getElementById('count-filter-delivered');

    if (countAll) countAll.textContent = orders.length;
    if (countNew) countNew.textContent = orders.filter((o) => o.status === 'new').length;
    if (countPrep) countPrep.textContent = orders.filter((o) => o.status === 'preparing').length;
    if (countDeliv) countDeliv.textContent = orders.filter((o) => o.status === 'delivery').length;
    if (countDelivered) countDelivered.textContent = orders.filter((o) => o.status === 'delivered').length;

    let filtered = orders;
    if (activeOrderFilter !== 'all') {
      filtered = orders.filter((o) => o.status === activeOrderFilter);
    }

    if (adminOrdersSearchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(adminOrdersSearchQuery) ||
          (o.customerName && o.customerName.toLowerCase().includes(adminOrdersSearchQuery)) ||
          (o.customerPhone && o.customerPhone.includes(adminOrdersSearchQuery)) ||
          (o.customerAddress && o.customerAddress.toLowerCase().includes(adminOrdersSearchQuery))
      );
    }

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="text-center py-12 p-6 rounded-3xl bg-gradient-to-b from-[#181c2b] to-[#0a0c14] border border-white/10">
          <div class="text-3xl mb-2">🧾</div>
          <div class="text-sm font-bold text-white">No matching orders found</div>
          <div class="text-xs text-gray-400 mt-1">Try another filter or click "+Test Order" to simulate a new live kitchen order!</div>
        </div>
      `;
      return;
    }

    const statusBadge = (st) => {
      const map = {
        new: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        preparing: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        delivery: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cancelled: 'bg-red-500/20 text-red-300 border-red-500/40'
      };
      return map[st] || 'bg-gray-800 text-gray-300';
    };

    list.innerHTML = filtered
      .map((ord) => {
        const itemsSummary = (ord.items || [])
          .map((i) => {
            const sizeStr = i.selectedSize && i.selectedSize.name ? ` (${i.selectedSize.name})` : '';
            const spiceStr = i.selectedSpice ? ` [${i.selectedSpice}]` : '';
            const extrasStr =
              i.selectedAddons && i.selectedAddons.length
                ? ` +${i.selectedAddons.map((a) => a.name).join(', ')}`
                : '';
            return `<div class="text-xs text-gray-300">• <b>${i.qty}x</b> ${i.name}${sizeStr}${spiceStr} <span class="text-emerald-400 font-medium">${extrasStr}</span></div>`;
          })
          .join('');

        const rawPhone = (ord.customerPhone || '').replace(/[^0-9]/g, '');
        const waPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
        const waMsg = `Hi ${ord.customerName}! Your LFC order #${ord.id} status is now: ${ord.status.toUpperCase()}. Total: Rs. ${ord.total}. Thank you for choosing Lahore Fried Chicken!`;
        const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

        return `
        <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#181c2b] via-[#121522] to-[#0a0c14] border border-white/10 space-y-3 shadow-xl hover:border-amber-400/40 transition">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-black text-white text-sm font-heading">${ord.id}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusBadge(
                  ord.status
                )}">
                  ${ord.status}
                </span>
                <span class="text-[11px] text-gray-400">${ord.date}</span>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">${ord.orderType || 'delivery'}</span>
              </div>
              <div class="text-xs text-amber-300 font-bold mt-1">
                ${ord.customerName} • 📞 ${ord.customerPhone} • 📍 ${ord.deliveryZone || 'Lahore'}
              </div>
            </div>

            <div class="flex items-center gap-1.5 flex-wrap">
              <button onclick="window.LFC.updateOrderStatus('${ord.id}', 'preparing')" class="px-2.5 py-1 rounded-lg ${ord.status === 'preparing' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'} text-[11px] font-bold transition" title="Mark Kitchen Preparing">
                👨‍🍳 Kitchen
              </button>
              <button onclick="window.LFC.updateOrderStatus('${ord.id}', 'delivery')" class="px-2.5 py-1 rounded-lg ${ord.status === 'delivery' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'} text-[11px] font-bold transition" title="Mark Out for Delivery">
                🛵 Delivery
              </button>
              <button onclick="window.LFC.updateOrderStatus('${ord.id}', 'delivered')" class="px-2.5 py-1 rounded-lg ${ord.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'} text-[11px] font-bold transition" title="Mark Delivered">
                ✅ Done
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center gap-1" title="WhatsApp Status Update to Customer">
                💬 WA
              </a>
              <button onclick="window.LFC.openReceiptModal('${ord.id}')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 text-[11px] font-bold transition flex items-center gap-1" title="Print Kitchen Slip">
                🖨️ Slip
              </button>
            </div>
          </div>

          <div class="space-y-1">
            ${itemsSummary}
          </div>

          ${
            ord.specialNotes
              ? `<div class="p-2.5 rounded-xl bg-[#0B0D16] border border-amber-500/20 text-[11px] text-amber-200/90 italic flex items-center gap-1.5">
                  <span>📝</span> <span>Note: "${ord.specialNotes}"</span>
                 </div>`
              : ''
          }

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-white/10 text-xs">
            <div class="text-gray-400">
              Address: <span class="text-gray-200 font-medium">${ord.customerAddress}</span>
            </div>
            <div class="text-base font-black text-amber-400 font-heading">
              Total: Rs. ${(ord.total || 0).toLocaleString()}
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  function filterOrders(status) {
    activeOrderFilter = status;
    const buttons = document.querySelectorAll('.order-filter-btn');
    buttons.forEach((b) => {
      const match =
        (status === 'all' && b.id === 'order-filter-all') ||
        (status === 'new' && b.id === 'order-filter-new') ||
        (status === 'preparing' && b.id === 'order-filter-preparing') ||
        (status === 'delivery' && b.id === 'order-filter-delivery') ||
        (status === 'delivered' && b.id === 'order-filter-delivered');
      b.className = match
        ? 'order-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black shadow flex-shrink-0'
        : 'order-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:text-white flex-shrink-0';
    });
    renderAdminOrders();
  }

  function updateOrderStatus(orderId, newStatus) {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    ord.status = newStatus;
    saveData('orders', orders);
    renderAdminOrders();
    renderAdminDashboard();
    showToast(`Order #${orderId} marked as ${newStatus}!`);
  }

  function exportOrdersCsv() {
    if (orders.length === 0) {
      showToast('No orders to export', 'error');
      return;
    }

    let csv = 'Order ID,Date,Customer Name,Phone,Address,Zone,Subtotal,Delivery,Discount,Total,Status\n';
    orders.forEach((o) => {
      const cleanAddr = `"${(o.customerAddress || '').replace(/"/g, '""')}"`;
      csv += `${o.id},"${o.date}","${o.customerName}","${o.customerPhone}",${cleanAddr},"${o.deliveryZone || ''}",${o.subtotal},${o.deliveryFee},${o.discount},${o.total},${o.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lfc-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('Orders exported to CSV!');
  }

  function clearCompletedOrders() {
    if (!confirm('Clear all delivered orders from list?')) return;
    orders = orders.filter((o) => o.status !== 'delivered');
    saveData('orders', orders);
    renderAdminOrders();
    renderAdminDashboard();
    showToast('Delivered orders cleared');
  }

  // --- Printable Thermal Receipt / Kitchen Slip ---
  function openReceiptModal(orderId) {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    const modal = document.getElementById('receipt-modal');
    const content = document.getElementById('receipt-modal-content');
    if (!modal || !content) return;

    const itemsRows = (ord.items || [])
      .map((i) => {
        const itemLine = `${i.qty}x ${i.name}`;
        const priceLine = `Rs. ${(i.price * i.qty).toLocaleString()}`;
        const size = i.selectedSize && i.selectedSize.name ? `[${i.selectedSize.name}]` : '';
        const spice = i.selectedSpice ? `Spice: ${i.selectedSpice}` : '';
        const addons =
          i.selectedAddons && i.selectedAddons.length ? `+ ${i.selectedAddons.map((a) => a.name).join(', ')}` : '';

        return `
        <div class="border-b border-dashed border-gray-300 pb-1.5">
          <div class="flex justify-between font-bold">
            <span>${itemLine}</span>
            <span>${priceLine}</span>
          </div>
          ${size || spice ? `<div class="text-[10px] text-gray-600">${size} ${spice}</div>` : ''}
          ${addons ? `<div class="text-[10px] text-gray-700">${addons}</div>` : ''}
        </div>
      `;
      })
      .join('');

    content.innerHTML = `
      <div class="text-center border-b-2 border-black pb-3">
        <h2 class="text-lg font-black tracking-wider uppercase font-sans">LAHORE FRIED CHICKEN</h2>
        <div class="text-[11px] font-bold">KITCHEN ORDER TICKET & RECEIPT</div>
        <div class="text-[10px] text-gray-600">Taste the Legend • 0322-4940181</div>
      </div>

      <div class="text-[11px] space-y-0.5 border-b border-dashed border-gray-400 pb-2">
        <div><b>ORDER #:</b> ${ord.id}</div>
        <div><b>TIME:</b> ${ord.date}</div>
        <div><b>TYPE:</b> ${ord.orderType.toUpperCase()}</div>
        <div><b>CUSTOMER:</b> ${ord.customerName}</div>
        <div><b>PHONE:</b> ${ord.customerPhone}</div>
        <div><b>AREA:</b> ${ord.deliveryZone || 'Lahore'}</div>
        <div><b>ADDRESS:</b> ${ord.customerAddress}</div>
        ${ord.specialNotes ? `<div><b>INSTRUCTIONS:</b> <span class="text-red-700">${ord.specialNotes}</span></div>` : ''}
      </div>

      <div class="space-y-2 py-2">
        ${itemsRows}
      </div>

      <div class="border-t-2 border-black pt-2 space-y-1 text-xs">
        <div class="flex justify-between"><span>SUBTOTAL:</span><span>Rs. ${(ord.subtotal || 0).toLocaleString()}</span></div>
        <div class="flex justify-between"><span>DELIVERY FEE:</span><span>${ord.deliveryFee === 0 ? 'FREE' : 'Rs. ' + ord.deliveryFee}</span></div>
        ${ord.discount > 0 ? `<div class="flex justify-between text-red-600"><span>DISCOUNT (${ord.promoCode || 'PROMO'}):</span><span>- Rs. ${ord.discount}</span></div>` : ''}
        <div class="flex justify-between font-black text-sm pt-1 border-t border-gray-400">
          <span>GRAND TOTAL:</span>
          <span>Rs. ${(ord.total || 0).toLocaleString()}</span>
        </div>
      </div>

      <div class="text-center pt-3 text-[10px] text-gray-500">
        Thank you for choosing LFC Lahore!<br/>
        Developer: Trivox solutions
      </div>
    `;

    modal.classList.remove('hidden');
  }

  function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (modal) modal.classList.add('hidden');
  }

  // --- Admin Menu Items & Multi-Options Manager ---
  let tempNewItemImage = './images/hero-1.jpg';

  function renderAdminBulk() {
    const box = document.getElementById('admin-menu-bulk');
    if (!box) return;
    const opts = categories.filter((c) => c.id !== 'all').map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
    const cl = 'px-2.5 py-2 rounded-lg bg-[#0B0C10] border border-gray-800 text-white text-xs outline-none focus:border-amber-500';
    const bt = 'px-3 py-2 rounded-lg font-black text-xs transition';
    box.innerHTML = `<div class="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#2a1a12] to-[#141826] border border-amber-500/30 space-y-3">
      <div class="text-xs font-black text-amber-300 uppercase tracking-wider">⚡ Bulk Tools</div>
      <div class="flex flex-wrap items-center gap-2"><select id="bulk-cat" class="${cl}"><option value="__all">All items</option>${opts}</select>
        <input id="bulk-pct" type="number" value="10" class="${cl} w-20" title="Percent"/><span class="text-xs text-gray-400 font-bold">%</span>
        <button onclick="window.LFC.bulkPrice(1)" class="${bt} bg-amber-500 hover:bg-amber-400 text-slate-950">▲ Raise price</button>
        <button onclick="window.LFC.bulkPrice(-1)" class="${bt} bg-gray-700 hover:bg-gray-600 text-white">▼ Lower price</button>
        <button onclick="window.LFC.bulkStock(true)" class="${bt} bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">✔ In stock</button>
        <button onclick="window.LFC.bulkStock(false)" class="${bt} bg-red-500/15 text-red-300 border border-red-500/30">✖ Sold out</button></div></div>`;
  }
  function bulkTargets() { const c = document.getElementById('bulk-cat').value; return menuItems.filter((m) => c === '__all' || m.cat === c); }
  function bulkPrice(dir) {
    const pct = Number(document.getElementById('bulk-pct').value) || 0;
    if (!pct) return;
    const t = bulkTargets();
    if (!t.length || !confirm(`${dir > 0 ? 'Raise' : 'Lower'} prices by ${pct}% for ${t.length} items?`)) return;
    const f = 1 + (dir * pct) / 100, r = (n) => Math.max(0, Math.round((n * f) / 10) * 10);
    t.forEach((m) => { m.price = r(m.price); (m.sizes || []).forEach((s) => (s.price = r(s.price))); (m.addons || []).forEach((a) => (a.price = r(a.price))); });
    saveData('menu_items', menuItems); renderMenu(); renderAdminMenuItems(); showToast(`Updated ${t.length} items`);
  }
  function bulkStock(inStock) {
    const t = bulkTargets();
    if (!t.length || !confirm(`Mark ${t.length} items as ${inStock ? 'in stock' : 'sold out'}?`)) return;
    t.forEach((m) => (m.inStock = inStock));
    saveData('menu_items', menuItems); renderMenu(); renderAdminMenuItems(); showToast(`Updated ${t.length} items`);
  }

  function renderAdminMenuItems() {
    renderAdminBulk();
    const list = document.getElementById('admin-menu-list');
    const countEl = document.getElementById('admin-menu-count');
    if (!list) return;

    if (countEl) countEl.textContent = menuItems.length;

    list.innerHTML = menuItems
      .map((item) => {
        const sizesStr = item.sizes && item.sizes.length ? `${item.sizes.length} sizes` : '1 size';
        const addonsStr = item.addons && item.addons.length ? `${item.addons.length} extras` : 'No extras';

        return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#141826] border border-gray-800 text-xs sm:text-sm gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${item.image}" alt="" class="w-12 h-12 rounded-xl object-cover bg-black flex-shrink-0 border border-gray-800" onerror="this.src='./images/hero-1.jpg'"/>
            <div class="min-w-0">
              <div class="font-extrabold text-white truncate flex items-center gap-2">
                <span>${item.name}</span>
                ${
                  item.badge
                    ? `<span class="px-2 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">${item.badge}</span>`
                    : ''
                }
              </div>
              <div class="text-[11px] text-gray-400">
                <span class="text-amber-400 uppercase font-bold">${item.cat}</span> • Base: Rs. ${item.price.toLocaleString()} • <span class="text-emerald-400">${sizesStr}</span> • <span class="text-blue-400">${addonsStr}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center">
            <button onclick="window.LFC.openEditItemModal(${item.id})" class="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold text-xs transition flex items-center gap-1">
              <span>✏️ Edit & Options</span>
            </button>
            <button onclick="window.LFC.toggleStock(${item.id})" class="px-2.5 py-1.5 rounded-xl text-xs font-black transition ${
              item.inStock
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                : 'bg-red-950/80 text-red-400 border border-red-800/80'
            }">
              ${item.inStock ? 'In Stock' : 'Out'}
            </button>
            <button onclick="window.LFC.deleteMenuItem(${item.id})" class="text-gray-500 hover:text-red-400 p-1.5 transition" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  function searchAdminMenu(q) {
    const filter = (q || '').toLowerCase().trim();
    const list = document.getElementById('admin-menu-list');
    if (!list) return;

    if (!filter) {
      renderAdminMenuItems();
      return;
    }

    const matched = menuItems.filter((m) => m.name.toLowerCase().includes(filter) || m.cat.toLowerCase().includes(filter));
    list.innerHTML = matched
      .map((item) => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-[#141826] border border-gray-800 text-xs sm:text-sm gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${item.image}" alt="" class="w-12 h-12 rounded-xl object-cover bg-black flex-shrink-0" onerror="this.src='./images/hero-1.jpg'"/>
            <div class="min-w-0">
              <div class="font-bold text-white truncate">${item.name}</div>
              <div class="text-[11px] text-amber-400">Rs. ${item.price.toLocaleString()} • ${item.cat}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.LFC.openEditItemModal(${item.id})" class="px-2.5 py-1.5 rounded-xl bg-gray-800 text-amber-300 font-bold text-xs">Edit</button>
            <button onclick="window.LFC.toggleStock(${item.id})" class="px-2.5 py-1.5 rounded-xl text-xs font-bold ${item.inStock ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}">${item.inStock ? 'In Stock' : 'Out'}</button>
          </div>
        </div>
      `)
      .join('');
  }

  function toggleStock(id) {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;
    item.inStock = !item.inStock;
    saveData('menu_items', menuItems);
    renderMenu();
    renderAdminMenuItems();
    showToast(`Updated stock status for ${item.name}`);
  }

  function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    menuItems = menuItems.filter((m) => m.id !== id);
    saveData('menu_items', menuItems);
    renderMenu();
    renderAdminMenuItems();
    renderAdminDashboard();
    showToast('Menu item deleted');
  }

  function addNewMenuItem() {
    const nameEl = document.getElementById('new-item-name');
    const catEl = document.getElementById('new-item-cat');
    const priceEl = document.getElementById('new-item-price');
    const descEl = document.getElementById('new-item-desc');
    const badgeEl = document.getElementById('new-item-badge');

    const name = nameEl ? nameEl.value.trim() : '';
    const cat = catEl ? catEl.value : 'burgers';
    const price = priceEl ? parseFloat(priceEl.value) : 0;
    const desc = descEl ? descEl.value.trim() : '';
    const badge = badgeEl ? badgeEl.value.trim() : 'New';

    if (!name || isNaN(price) || price <= 0) {
      showToast('Please enter a valid item name and price', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      cat,
      price,
      desc: desc || 'Crispy delicious freshly prepared LFC special.',
      image: tempNewItemImage || './images/hero-1.jpg',
      badge: badge || 'New',
      inStock: true,
      spiciness: 2,
      sizes: [
        { name: 'Regular Portion', price: 0 },
        { name: 'Double / Large Portion', price: 180 },
        { name: 'Meal (With Fries & Drink)', price: 250 }
      ],
      spiceLevels: ['Mild Crunchy', 'Hot Spicy Lahori', 'Extra Ghost Pepper 🔥'],
      addons: [
        { name: 'Extra Garlic Mayo Dip', price: 60 },
        { name: 'Melted Cheddar Slice', price: 80 },
        { name: 'Peri Peri Masala Fries', price: 120 },
        { name: 'Chilled Soft Drink Can', price: 90 }
      ]
    };

    menuItems.unshift(newItem);
    saveData('menu_items', menuItems);

    if (nameEl) nameEl.value = '';
    if (priceEl) priceEl.value = '';
    if (descEl) descEl.value = '';

    renderMenu();
    renderAdminMenuItems();
    renderAdminDashboard();
    showToast(`Added ${name} with multi-options to menu!`);
  }

  // --- Admin Edit Menu Item Modal & Multi-Options Rows ---
  let currentEditingItem = null;

  function openEditItemModal(itemId) {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    currentEditingItem = JSON.parse(JSON.stringify(item));

    const modal = document.getElementById('admin-edit-item-modal');
    const idEl = document.getElementById('edit-item-id');
    const nameEl = document.getElementById('edit-item-name');
    const catEl = document.getElementById('edit-item-cat');
    const priceEl = document.getElementById('edit-item-price');
    const badgeEl = document.getElementById('edit-item-badge');
    const stockEl = document.getElementById('edit-item-stock');
    const descEl = document.getElementById('edit-item-desc');
    const imgEl = document.getElementById('edit-item-image');

    if (idEl) idEl.value = item.id;
    if (nameEl) nameEl.value = item.name;
    setTimeout(refreshEditImage, 0);
    if (priceEl) priceEl.value = item.price;
    if (badgeEl) badgeEl.value = item.badge || '';
    if (stockEl) stockEl.value = item.inStock ? 'true' : 'false';
    if (descEl) descEl.value = item.desc || '';
    if (imgEl) imgEl.value = item.image || '';

    // Populate category dropdown
    if (catEl) {
      catEl.innerHTML = categories
        .filter((c) => c.id !== 'all')
        .map((c) => `<option value="${c.id}" ${c.id === item.cat ? 'selected' : ''}>${c.name}</option>`)
        .join('');
    }

    renderEditSizesRows();
    renderEditAddonsRows();

    if (modal) modal.classList.remove('hidden');
  }

  function closeEditItemModal() {
    const modal = document.getElementById('admin-edit-item-modal');
    if (modal) modal.classList.add('hidden');
    currentEditingItem = null;
  }

  function renderEditSizesRows() {
    const container = document.getElementById('edit-sizes-container');
    if (!container || !currentEditingItem) return;

    const sizes = currentEditingItem.sizes || [];
    container.innerHTML = sizes
      .map(
        (s, idx) => `
        <div class="flex items-center gap-2">
          <input type="text" value="${s.name}" onchange="window.LFC.updateEditSizeName(${idx}, this.value)" placeholder="Size Name" class="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B0D16] border border-gray-800 text-xs text-white"/>
          <div class="flex items-center gap-1 w-28">
            <span class="text-[10px] text-gray-500">+Rs.</span>
            <input type="number" value="${s.price}" onchange="window.LFC.updateEditSizePrice(${idx}, this.value)" class="w-full px-2 py-1.5 rounded-lg bg-[#0B0D16] border border-gray-800 text-xs text-white"/>
          </div>
          <button type="button" onclick="window.LFC.removeEditSizeRow(${idx})" class="text-red-400 hover:text-red-300 p-1 font-bold">✕</button>
        </div>
      `
      )
      .join('');
  }

  function addEditSizeRow() {
    if (!currentEditingItem) return;
    if (!currentEditingItem.sizes) currentEditingItem.sizes = [];
    currentEditingItem.sizes.push({ name: 'New Size', price: 100 });
    renderEditSizesRows();
  }

  function removeEditSizeRow(idx) {
    if (!currentEditingItem || !currentEditingItem.sizes) return;
    currentEditingItem.sizes.splice(idx, 1);
    renderEditSizesRows();
  }

  function updateEditSizeName(idx, val) {
    if (currentEditingItem && currentEditingItem.sizes && currentEditingItem.sizes[idx]) {
      currentEditingItem.sizes[idx].name = val;
    }
  }

  function updateEditSizePrice(idx, val) {
    if (currentEditingItem && currentEditingItem.sizes && currentEditingItem.sizes[idx]) {
      currentEditingItem.sizes[idx].price = Number(val) || 0;
    }
  }

  function renderEditAddonsRows() {
    const container = document.getElementById('edit-addons-container');
    if (!container || !currentEditingItem) return;

    const addons = currentEditingItem.addons || [];
    container.innerHTML = addons
      .map(
        (a, idx) => `
        <div class="flex items-center gap-2">
          <input type="text" value="${a.name}" onchange="window.LFC.updateEditAddonName(${idx}, this.value)" placeholder="Add-on Name" class="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B0D16] border border-gray-800 text-xs text-white"/>
          <div class="flex items-center gap-1 w-28">
            <span class="text-[10px] text-gray-500">+Rs.</span>
            <input type="number" value="${a.price}" onchange="window.LFC.updateEditAddonPrice(${idx}, this.value)" class="w-full px-2 py-1.5 rounded-lg bg-[#0B0D16] border border-gray-800 text-xs text-white"/>
          </div>
          <button type="button" onclick="window.LFC.removeEditAddonRow(${idx})" class="text-red-400 hover:text-red-300 p-1 font-bold">✕</button>
        </div>
      `
      )
      .join('');
  }

  function addEditAddonRow() {
    if (!currentEditingItem) return;
    if (!currentEditingItem.addons) currentEditingItem.addons = [];
    currentEditingItem.addons.push({ name: 'Extra Dip Sauce', price: 60 });
    renderEditAddonsRows();
  }

  function removeEditAddonRow(idx) {
    if (!currentEditingItem || !currentEditingItem.addons) return;
    currentEditingItem.addons.splice(idx, 1);
    renderEditAddonsRows();
  }

  function updateEditAddonName(idx, val) {
    if (currentEditingItem && currentEditingItem.addons && currentEditingItem.addons[idx]) {
      currentEditingItem.addons[idx].name = val;
    }
  }

  function updateEditAddonPrice(idx, val) {
    if (currentEditingItem && currentEditingItem.addons && currentEditingItem.addons[idx]) {
      currentEditingItem.addons[idx].price = Number(val) || 0;
    }
  }

  function saveEditedMenuItem() {
    const idEl = document.getElementById('edit-item-id');
    const nameEl = document.getElementById('edit-item-name');
    const catEl = document.getElementById('edit-item-cat');
    const priceEl = document.getElementById('edit-item-price');
    const badgeEl = document.getElementById('edit-item-badge');
    const stockEl = document.getElementById('edit-item-stock');
    const descEl = document.getElementById('edit-item-desc');
    const imgEl = document.getElementById('edit-item-image');

    const itemId = Number(idEl ? idEl.value : 0);
    const itemIndex = menuItems.findIndex((m) => m.id === itemId);
    if (itemIndex < 0) return;

    menuItems[itemIndex].name = nameEl ? nameEl.value.trim() : menuItems[itemIndex].name;
    menuItems[itemIndex].cat = catEl ? catEl.value : menuItems[itemIndex].cat;
    menuItems[itemIndex].price = priceEl ? parseFloat(priceEl.value) || menuItems[itemIndex].price : menuItems[itemIndex].price;
    menuItems[itemIndex].badge = badgeEl ? badgeEl.value.trim() : '';
    menuItems[itemIndex].inStock = stockEl ? stockEl.value === 'true' : true;
    menuItems[itemIndex].desc = descEl ? descEl.value.trim() : menuItems[itemIndex].desc;
    menuItems[itemIndex].image = imgEl && imgEl.value.trim() ? imgEl.value.trim() : menuItems[itemIndex].image;

    if (currentEditingItem) {
      if (currentEditingItem.sizes) menuItems[itemIndex].sizes = currentEditingItem.sizes;
      if (currentEditingItem.addons) menuItems[itemIndex].addons = currentEditingItem.addons;
    }

    saveData('menu_items', menuItems);
    renderMenu();
    renderAdminMenuItems();
    closeEditItemModal();
    showToast('Dish & multi-options saved successfully!');
  }

  // --- Promo Codes & Coupons Manager ---
  function renderAdminCoupons() {
    const list = document.getElementById('admin-coupons-list');
    if (!list) return;

    list.innerHTML = promos
      .map(
        (p) => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-[#141826] border border-gray-800 text-xs sm:text-sm gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">${p.code}</span>
              <span class="font-bold text-white">${p.type === 'percent' ? `${p.discount}% OFF` : `Rs. ${p.discount} OFF`}</span>
              <span class="text-[10px] ${p.active ? 'text-emerald-400' : 'text-gray-500 font-bold'}">${p.active ? '● Active' : '● Disabled'}</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">${p.desc || `Min order Rs. ${p.minOrder || 0}`}</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.LFC.togglePromoCode('${p.code}')" class="px-2.5 py-1 rounded-xl text-xs font-bold ${p.active ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-800 text-gray-400'}">
              ${p.active ? 'Disable' : 'Enable'}
            </button>
            <button onclick="window.LFC.deletePromoCode('${p.code}')" class="text-gray-500 hover:text-red-400 p-1" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      `
      )
      .join('');
  }

  function addNewPromoCode() {
    const codeEl = document.getElementById('new-promo-code');
    const typeEl = document.getElementById('new-promo-type');
    const discountEl = document.getElementById('new-promo-discount');
    const minEl = document.getElementById('new-promo-min');
    const descEl = document.getElementById('new-promo-desc');

    const code = codeEl ? codeEl.value.trim().toUpperCase() : '';
    const type = typeEl ? typeEl.value : 'flat';
    const discount = discountEl ? parseFloat(discountEl.value) : 0;
    const minOrder = minEl ? parseFloat(minEl.value) || 0 : 0;
    const desc = descEl ? descEl.value.trim() : '';

    if (!code || isNaN(discount) || discount <= 0) {
      showToast('Please enter coupon code and discount amount', 'error');
      return;
    }

    if (promos.some((p) => p.code.toUpperCase() === code)) {
      showToast('Coupon code already exists', 'error');
      return;
    }

    promos.unshift({
      code,
      type,
      discount,
      minOrder,
      active: true,
      desc: desc || `${type === 'percent' ? discount + '% OFF' : 'Rs. ' + discount + ' OFF'} on orders above Rs. ${minOrder}`
    });

    saveData('promos', promos);
    renderAdminCoupons();
    renderAdminDashboard();

    if (codeEl) codeEl.value = '';
    if (discountEl) discountEl.value = '';
    if (minEl) minEl.value = '';
    if (descEl) descEl.value = '';

    showToast(`Created coupon code: ${code}`);
  }

  function togglePromoCode(code) {
    const promo = promos.find((p) => p.code === code);
    if (!promo) return;
    promo.active = !promo.active;
    saveData('promos', promos);
    renderAdminCoupons();
    renderAdminDashboard();
    showToast(`Coupon ${code} ${promo.active ? 'enabled' : 'disabled'}`);
  }

  function deletePromoCode(code) {
    if (!confirm(`Delete coupon code ${code}?`)) return;
    promos = promos.filter((p) => p.code !== code);
    saveData('promos', promos);
    renderAdminCoupons();
    renderAdminDashboard();
    showToast('Coupon deleted');
  }

  // --- Delivery Zones Manager ---
  function renderAdminZones() {
    const list = document.getElementById('admin-zones-list');
    if (!list) return;

    list.innerHTML = zones
      .map(
        (z) => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-[#141826] border border-gray-800 text-xs sm:text-sm gap-3">
          <div>
            <div class="font-extrabold text-white flex items-center gap-2">
              <span>${z.name}</span>
              <span class="text-amber-400 font-bold">Rs. ${z.fee}</span>
            </div>
            <div class="text-[11px] text-emerald-400 mt-0.5">⏱️ ${z.time} delivery time</div>
          </div>
          <button onclick="window.LFC.deleteDeliveryZone('${z.id}')" class="text-gray-500 hover:text-red-400 p-1" title="Delete Zone">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      `
      )
      .join('');
  }

  function addNewDeliveryZone() {
    const nameEl = document.getElementById('new-zone-name');
    const feeEl = document.getElementById('new-zone-fee');
    const timeEl = document.getElementById('new-zone-time');

    const name = nameEl ? nameEl.value.trim() : '';
    const fee = feeEl ? parseFloat(feeEl.value) : 150;
    const time = timeEl ? timeEl.value.trim() : '25-35 mins';

    if (!name || isNaN(fee)) {
      showToast('Please enter zone name and delivery fee', 'error');
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    zones.push({ id, name, fee, time });
    saveData('zones', zones);

    renderAdminZones();
    renderZoneSelect();
    renderAdminDashboard();

    if (nameEl) nameEl.value = '';
    if (feeEl) feeEl.value = '';
    if (timeEl) timeEl.value = '';

    showToast(`Added delivery zone: ${name}`);
  }

  function deleteDeliveryZone(id) {
    if (zones.length <= 1) {
      showToast('You must keep at least 1 delivery zone', 'error');
      return;
    }
    if (!confirm('Delete this delivery zone?')) return;
    zones = zones.filter((z) => z.id !== id);
    if (settings.selectedZoneId === id) {
      settings.selectedZoneId = zones[0].id;
    }
    saveData('zones', zones);
    saveData('settings', settings);
    renderAdminZones();
    renderZoneSelect();
    renderAdminDashboard();
    updateCartUI();
    showToast('Delivery zone removed');
  }

  // --- Store Status Switch ---
  function updateStoreStatus(status) {
    settings.storeStatus = status;
    saveData('settings', settings);

    const quickSelect = document.getElementById('admin-quick-status-select');
    const settingSelect = document.getElementById('admin-setting-status');
    if (quickSelect) quickSelect.value = status;
    if (settingSelect) settingSelect.value = status;

    renderAdminDashboard();
    showToast(`Store status set to: ${status.toUpperCase()}`);
  }

  // --- Data Backup & Restore ---
  function exportDataJson() {
    const backup = {
      settings,
      menuItems,
      categories,
      heroSlides,
      heroConfig,
      branches,
      zones,
      promos,
      orders,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lfc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Store data downloaded as JSON backup!');
  }

  function importDataJson(fileInput) {
    if (!fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) {
          settings = { ...DEFAULT_SETTINGS, ...data.settings };
          saveData('settings', settings);
        }
        if (data.menuItems && Array.isArray(data.menuItems)) {
          menuItems = data.menuItems;
          saveData('menu_items', menuItems);
        }
        if (data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
          saveData('categories', categories);
        }
        if (data.heroConfig) { heroConfig = Object.assign(heroConfig, data.heroConfig); saveData('hero_config', heroConfig); }
        if (data.heroSlides && Array.isArray(data.heroSlides)) {
          heroSlides = data.heroSlides;
          saveData('hero_slides', heroSlides);
        }
        if (data.branches && Array.isArray(data.branches)) {
          branches = data.branches;
          saveData('branches', branches);
        }
        if (data.zones && Array.isArray(data.zones)) {
          zones = data.zones;
          saveData('zones', zones);
        }
        if (data.promos && Array.isArray(data.promos)) {
          promos = data.promos;
          saveData('promos', promos);
        }
        if (data.orders && Array.isArray(data.orders)) {
          orders = data.orders;
          saveData('orders', orders);
        }

        updateBrandLogos();
        renderCategories();
        renderMenu();
        renderHeroSlide(0);
        renderBranches();
        renderAdminDashboard();
        renderAdminOrders();
        renderAdminMenuItems();
        renderAdminCoupons();
        renderAdminZones();
        renderAdminCategories();
        renderAdminHeroSlides();
        renderAdminBranches();
        renderAdminSettings();
        updateCartUI();

        showToast('Store data restored successfully!');
      } catch (err) {
        showToast('Invalid backup file', 'error');
      }
    };
    reader.readAsText(file);
  }

  // --- Admin Categories Manager ---
  function renderAdminCategories() {
    const list = document.getElementById('admin-categories-list');
    if (!list) return;

    list.innerHTML = categories
      .map((cat) => {
        const count = cat.id === 'all' ? menuItems.length : menuItems.filter((m) => m.cat === cat.id).length;
        const isAll = cat.id === 'all';
        return `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-[#141826] border border-gray-800 text-xs sm:text-sm gap-2">
          <div class="flex-1 min-w-0">
            <div class="font-extrabold text-white truncate flex items-center gap-2">
              <span>${cat.name}</span>
              <span class="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">${cat.id}</span>
            </div>
            <div class="text-[11px] text-gray-400">${count} dish(es) linked</div>
          </div>
          ${
            !isAll
              ? `
            <div class="flex items-center gap-1.5">
              <button onclick="window.LFC.promptEditCategory('${cat.id}')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold text-xs transition">
                Rename
              </button>
              <button onclick="window.LFC.deleteCategory('${cat.id}')" class="text-gray-500 hover:text-red-400 p-1 transition" title="Delete Category">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          `
              : '<span class="text-[10px] text-gray-500 font-bold px-2 py-1">System Default</span>'
          }
        </div>
      `;
      })
      .join('');

    const catSelect = document.getElementById('new-item-cat');
    if (catSelect) {
      catSelect.innerHTML = categories
        .filter((c) => c.id !== 'all')
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join('');
    }
  }

  function addNewCategory() {
    const idEl = document.getElementById('new-cat-id');
    const nameEl = document.getElementById('new-cat-name');

    const name = nameEl ? nameEl.value.trim() : '';
    let id = idEl ? idEl.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';

    if (!name) {
      showToast('Please enter category name', 'error');
      return;
    }

    if (!id) {
      id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    if (categories.some((c) => c.id === id)) {
      showToast('Category ID already exists', 'error');
      return;
    }

    categories.push({ id, name });
    saveData('categories', categories);
    renderCategories();
    renderAdminCategories();

    if (idEl) idEl.value = '';
    if (nameEl) nameEl.value = '';
    showToast(`Added category: ${name}`);
  }

  function promptEditCategory(id) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newName = prompt('Enter new display name for category:', cat.name);
    if (newName && newName.trim()) {
      cat.name = newName.trim();
      saveData('categories', categories);
      renderCategories();
      renderAdminCategories();
      showToast('Category updated!');
    }
  }

  function deleteCategory(id) {
    if (id === 'all') {
      showToast('Cannot delete system default category', 'error');
      return;
    }
    if (!confirm('Are you sure you want to delete this category? (Dishes will remain in the menu)')) return;
    categories = categories.filter((c) => c.id !== id);
    saveData('categories', categories);
    if (activeCategory === id) activeCategory = 'all';
    renderCategories();
    renderAdminCategories();
    renderMenu();
    showToast('Category deleted');
  }

  // --- Admin Hero Slides Manager ---
  const hxe = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const adminHeroOpen = new Set();

  function renderAdminHeroSlides() {
    const list = document.getElementById('admin-hero-list');
    if (!list) return;
    const cls = 'w-full px-2.5 py-2 rounded-lg bg-[#0B0C10] border border-gray-800 text-white text-xs focus:border-amber-500 outline-none';
    const lbl = 'text-[10px] text-gray-400 block mb-0.5 font-bold uppercase tracking-wide';
    const btn = 'px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-[11px] transition';
    const inp = (i, f, label, v, ph) => `<div><label class="${lbl}">${label}</label><input type="text" value="${hxe(v)}" placeholder="${hxe(ph || '')}" onchange="window.LFC.updateHeroSlideField(${i}, '${f}', this.value)" class="${cls}"/></div>`;
    const dealOpts = (sel) => '<option value="">Auto-match by name</option>' + menuItems.map((m) => `<option value="${hxe(m.id)}" ${String(m.id) === String(sel) ? 'selected' : ''}>${hxe(m.name)} — Rs. ${m.price || ''}</option>`).join('');
    const chk = (k, label) => `<label class="flex items-center gap-2 text-xs text-gray-200 font-bold cursor-pointer"><input type="checkbox" ${heroConfig[k] !== false ? 'checked' : ''} onchange="window.LFC.setHeroConfig('${k}', this.checked)" class="accent-amber-500 w-4 h-4"/>${label}</label>`;

    const settings = `<div class="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1b2140] to-[#141826] border border-amber-500/30 space-y-3">
      <div class="text-xs font-black text-amber-300 uppercase tracking-wider">⚙️ Hero Settings</div>
      <div class="grid grid-cols-2 gap-2.5">${chk('autoplay', 'Autoplay slides')}${chk('showThumbs', 'Show thumbnails')}${chk('showPrice', 'Show price box')}
        <div class="flex items-center gap-2 text-xs text-gray-200 font-bold">Every <input type="number" min="3" max="30" value="${Number(heroConfig.interval) || 6}" onchange="window.LFC.setHeroConfig('interval', Number(this.value))" class="w-14 px-2 py-1 rounded-lg bg-[#0B0C10] border border-gray-800 text-white text-xs"/> sec</div></div>
      <div class="flex gap-2"><button onclick="window.LFC.addHeroSlide()" class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition">＋ Add New Slide</button><button onclick="window.LFC.resetHeroSlides()" class="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-xs transition">Reset Hero</button></div></div>`;

    const cards = heroSlides.map((s, i) => {
      const on = s.enabled !== false;
      const isData = s.image && s.image.startsWith('data:');
      return `<details ${adminHeroOpen.has(s.id) ? 'open' : ''} ontoggle="window.LFC.heroOpen(${s.id}, this.open)" class="rounded-2xl bg-[#141826] border ${on ? 'border-gray-800' : 'border-gray-800 opacity-60'} overflow-hidden">
        <summary class="flex items-center gap-3 p-3 cursor-pointer list-none">
          <img src="${hxe(s.image)}" alt="" class="w-14 h-14 rounded-xl object-cover bg-black flex-shrink-0 border border-gray-800" onerror="this.src='./images/hero-1.jpg'"/>
          <div class="flex-1 min-w-0"><div class="font-extrabold text-white text-xs sm:text-sm truncate">${hxe(s.title)} <span class="text-amber-400">${hxe(s.highlight)}</span></div>
          <div class="text-[11px] text-gray-400 truncate">Slide #${i + 1} • ${hxe(s.priceTag)} ${s.oldPrice ? '<s class="text-gray-600">' + hxe(s.oldPrice) + '</s>' : ''}</div></div>
          <span class="text-[10px] font-black px-2 py-1 rounded-full ${on ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-700 text-gray-400'}">${on ? 'LIVE' : 'HIDDEN'}</span>
          <span class="text-gray-500 text-xs">▾</span>
        </summary>
        <div class="p-3 pt-1 space-y-3 border-t border-gray-800/70">
          <div class="flex flex-wrap gap-1.5">
            <button class="${btn}" onclick="window.LFC.moveHeroSlide(${i}, -1)">↑ Up</button><button class="${btn}" onclick="window.LFC.moveHeroSlide(${i}, 1)">↓ Down</button>
            <button class="${btn}" onclick="window.LFC.previewHeroSlide(${i}); window.LFC.closeAdminModal();">👁 Preview</button>
            <button class="${btn}" onclick="window.LFC.toggleHeroSlide(${i})">${on ? '🙈 Hide' : '👁 Show'}</button>
            <button class="${btn}" onclick="window.LFC.duplicateHeroSlide(${i})">⧉ Duplicate</button>
            <button class="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-300 font-bold text-[11px] transition" onclick="window.LFC.deleteHeroSlide(${i})">🗑 Delete</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${inp(i, 'title', 'Headline (line 1)', s.title)}${inp(i, 'highlight', 'Highlight (line 2, colored)', s.highlight)}
          </div>
          <div><label class="${lbl}">Description</label><textarea rows="3" onchange="window.LFC.updateHeroSlideField(${i}, 'subtitle', this.value)" class="${cls}">${hxe(s.subtitle)}</textarea></div>
          <div class="grid grid-cols-3 gap-2.5">
            ${inp(i, 'priceTag', 'Price', s.priceTag, 'Rs. 2,890')}${inp(i, 'oldPrice', 'Old price (crossed)', s.oldPrice, 'Rs. 3,490')}${inp(i, 'priceLabel', 'Price label', s.priceLabel, 'Combo Price')}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${inp(i, 'badgeText', 'Top badge text', s.badgeText)}${inp(i, 'rating', 'Rating text', s.rating, '4.9 ★ (1,840+ reviews)')}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${inp(i, 'ctaText', 'Button text', s.ctaText, 'Order Now')}
            <div><label class="${lbl}">Button opens menu item</label><select onchange="window.LFC.updateHeroSlideField(${i}, 'targetDealId', this.value === '' ? null : (isNaN(Number(this.value)) ? this.value : Number(this.value)))" class="${cls}">${dealOpts(s.targetDealId)}</select></div>
          </div>
          <div>${inp(i, 'image', 'Photo URL / path (or upload below)', isData ? '(uploaded photo)' : s.image)}</div>
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <label class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer transition">📷 Upload Photo<input type="file" accept="image/*" class="hidden" onchange="window.LFC.uploadHeroSlidePhoto(${i}, this)"/></label>
            ${isData ? `<button onclick="window.LFC.downloadHeroPhoto(${i})" class="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition">⬇ Download hero-${i + 1}.jpg</button>` : ''}
            <button onclick="window.LFC.resetHeroPhoto(${i})" class="${btn}">↺ Default photo</button>
          </div>
        </div>
      </details>`;
    }).join('');

    list.innerHTML = settings + cards + '<div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">📌 Changes are saved in <b>this browser</b>. To show a new photo to <b>every visitor</b>: tap Download, then in GitHub replace <code>images/hero-N.jpg</code> with that file and commit.</div>';
  }

  function heroRefresh(focusIdx) {
    saveData('hero_slides', heroSlides);
    renderAdminHeroSlides();
    renderHeroSlide(Math.min(activeSlideIndex, Math.max(0, activeSlides().length - 1)));
    startHeroTimer();
  }
  function previewHeroSlide(idx) {
    const pos = activeSlides().indexOf(heroSlides[idx]);
    if (pos < 0) { showToast('Slide is hidden — click Show to preview it'); return; }
    renderHeroSlide(pos); startHeroTimer();
  }
  function addHeroSlide() {
    const id = heroSlides.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0) + 1;
    heroSlides.push({ id, title: 'NEW OFFER', highlight: 'YOUR DISH NAME', subtitle: 'Write a short, mouth-watering description here.', badgeText: '🔥 New at LFC', image: './images/hero-1.jpg', priceTag: 'Rs. 999', oldPrice: '', priceLabel: 'Special Price', tag: 'New', rating: '4.9 ★ (1,000+ reviews)', ctaText: 'Order Now', targetDealId: null, enabled: true });
    adminHeroOpen.add(id); heroRefresh(); showToast('New slide added');
  }
  function duplicateHeroSlide(idx) {
    const c = JSON.parse(JSON.stringify(heroSlides[idx]));
    c.id = heroSlides.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0) + 1;
    heroSlides.splice(idx + 1, 0, c); adminHeroOpen.add(c.id); heroRefresh(); showToast('Slide duplicated');
  }
  function deleteHeroSlide(idx) {
    if (heroSlides.length <= 1) { showToast('You need at least one slide'); return; }
    if (!confirm('Delete this hero slide?')) return;
    heroSlides.splice(idx, 1); heroRefresh(); showToast('Slide deleted');
  }
  function moveHeroSlide(idx, dir) {
    const j = idx + dir;
    if (j < 0 || j >= heroSlides.length) return;
    [heroSlides[idx], heroSlides[j]] = [heroSlides[j], heroSlides[idx]]; heroRefresh();
  }
  function toggleHeroSlide(idx) {
    const s = heroSlides[idx];
    if (s.enabled !== false && heroSlides.filter((x) => x.enabled !== false).length <= 1) { showToast('At least one slide must stay live'); return; }
    s.enabled = s.enabled === false; heroRefresh();
  }
  function resetHeroPhoto(idx) {
    const d = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length];
    heroSlides[idx].image = d.image; heroRefresh(); showToast('Default photo restored');
  }
  function resetHeroSlides() {
    if (!confirm('Reset ALL hero slides and settings to the original defaults?')) return;
    heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    heroConfig = { autoplay: true, interval: 6, showThumbs: true, showPrice: true };
    saveData('hero_config', heroConfig); activeSlideIndex = 0; heroRefresh(); showToast('Hero reset');
  }
  function setHeroConfig(key, val) {
    heroConfig[key] = val; saveData('hero_config', heroConfig);
    renderHeroSlide(activeSlideIndex); startHeroTimer(); showToast('Hero setting saved');
  }

  function updateHeroSlideField(idx, field, val) {
    if (!heroSlides[idx]) return;
    if (field === 'image' && (!val || val === '(uploaded photo)')) return;
    heroSlides[idx][field] = val;
    saveData('hero_slides', heroSlides);
    renderHeroSlide(activeSlideIndex);
    showToast(`Slide #${idx + 1} updated`);
  }

  function uploadHeroSlidePhoto(idx, input) {
    if (!input.files || !input.files[0] || !heroSlides[idx]) return;
    handlePhotoUpload(input, '', (base64) => {
      const prev = heroSlides[idx].image;
      heroSlides[idx].image = base64;
      if (!saveData('hero_slides', heroSlides)) { heroSlides[idx].image = prev; return false; }
      renderAdminHeroSlides();
      previewHeroSlide(idx); // jump to the edited slide so the new photo is what you see
      showToast(`Slide #${idx + 1} photo updated!`);
      return false;
    }, { maxDim: 1400, quality: 0.82 });
  }

  function downloadHeroPhoto(idx) {
    const s = heroSlides[idx];
    if (!s || !s.image || !s.image.startsWith('data:')) return;
    const a = document.createElement('a');
    a.href = s.image;
    a.download = `hero-${idx + 1}.jpg`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // --- Admin Branches Management ---
  function renderAdminBranches() {
    const list = document.getElementById('admin-branches-list');
    if (!list) return;

    list.innerHTML = branches
      .map(
        (b) => `
        <div class="p-3.5 rounded-2xl bg-[#141826] border border-gray-800 space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-white text-xs sm:text-sm">${b.name}</h4>
            <button onclick="window.LFC.deleteBranch(${b.id})" class="text-gray-500 hover:text-red-400 p-1 transition" title="Delete Branch">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
          <div class="text-[11px] text-gray-400">${b.address}</div>
          <div class="flex items-center gap-3 text-[11px] text-amber-400 font-bold">
            <span>📞 ${b.phone}</span>
            <span>🕒 ${b.timings}</span>
          </div>
        </div>
      `
      )
      .join('');
  }

  function addNewBranch() {
    const nameEl = document.getElementById('new-branch-name');
    const addressEl = document.getElementById('new-branch-address');
    const phoneEl = document.getElementById('new-branch-phone');
    const timingsEl = document.getElementById('new-branch-timings');
    const mapEl = document.getElementById('new-branch-map');

    const name = nameEl ? nameEl.value.trim() : '';
    const address = addressEl ? addressEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() || settings.phoneCallNumber : settings.phoneCallNumber;
    const timings = timingsEl ? timingsEl.value.trim() || '12:00 PM - 02:00 AM' : '12:00 PM - 02:00 AM';
    const mapUrl = mapEl ? mapEl.value.trim() || 'https://maps.google.com/?q=Lahore' : 'https://maps.google.com/?q=Lahore';

    if (!name || !address) {
      showToast('Please enter Branch Name and Address', 'error');
      return;
    }

    const newBranch = {
      id: Date.now(),
      name,
      address,
      phone,
      timings,
      mapUrl
    };

    branches.push(newBranch);
    saveData('branches', branches);

    if (nameEl) nameEl.value = '';
    if (addressEl) addressEl.value = '';

    renderBranches();
    renderAdminBranches();
    renderAdminDashboard();
    showToast(`Added branch: ${name}`);
  }

  function deleteBranch(id) {
    if (branches.length <= 1) {
      showToast('You must keep at least 1 branch', 'error');
      return;
    }
    if (!confirm('Are you sure you want to delete this branch?')) return;
    branches = branches.filter((b) => b.id !== id);
    saveData('branches', branches);
    renderBranches();
    renderAdminBranches();
    renderAdminDashboard();
    showToast('Branch removed');
  }

  // --- Admin Branding & Logo Customizer ---
  function uploadCustomLogo(input) {
    if (!input.files || !input.files[0]) return;
    handlePhotoUpload(input, 'admin-logo-preview', (base64) => {
      settings.logoUrl = base64;
      saveData('settings', settings);
      updateBrandLogos();
      showToast('Site logo changed successfully!');
    });
  }

  function setLogoUrlManually(url) {
    if (!url) return;
    settings.logoUrl = url;
    saveData('settings', settings);
    updateBrandLogos();
    const preview = document.getElementById('admin-logo-preview');
    if (preview) preview.src = url;
    showToast('Site logo updated from URL!');
  }

  // --- Admin Store Settings ---
  function renderAdminSettings() {
    const waEl = document.getElementById('admin-setting-wa');
    const phoneEl = document.getElementById('admin-setting-phone');
    const feeEl = document.getElementById('admin-setting-fee');
    const freeEl = document.getElementById('admin-setting-free');
    const nameEl = document.getElementById('admin-setting-storename');
    const statusEl = document.getElementById('admin-setting-status');
    const announceEl = document.getElementById('admin-setting-announcement');

    if (waEl) waEl.value = settings.whatsappNumber;
    if (phoneEl) phoneEl.value = settings.phoneCallNumber;
    if (feeEl) feeEl.value = settings.deliveryFee;
    if (freeEl) freeEl.value = settings.freeDeliveryAbove;
    if (nameEl) nameEl.value = settings.storeName;
    if (statusEl) statusEl.value = settings.storeStatus || 'open';
    if (announceEl) announceEl.value = settings.announcementText || '';

    const logoPreview = document.getElementById('admin-logo-preview');
    if (logoPreview) logoPreview.src = settings.logoUrl || './images/logo.png';
  }

  function saveAdminSettings() {
    const waEl = document.getElementById('admin-setting-wa');
    const phoneEl = document.getElementById('admin-setting-phone');
    const feeEl = document.getElementById('admin-setting-fee');
    const freeEl = document.getElementById('admin-setting-free');
    const nameEl = document.getElementById('admin-setting-storename');
    const statusEl = document.getElementById('admin-setting-status');
    const announceEl = document.getElementById('admin-setting-announcement');

    if (waEl && waEl.value.trim()) settings.whatsappNumber = waEl.value.trim();
    if (phoneEl && phoneEl.value.trim()) settings.phoneCallNumber = phoneEl.value.trim();
    if (feeEl && !isNaN(parseFloat(feeEl.value))) settings.deliveryFee = parseFloat(feeEl.value);
    if (freeEl && !isNaN(parseFloat(freeEl.value))) settings.freeDeliveryAbove = parseFloat(freeEl.value);
    if (nameEl && nameEl.value.trim()) settings.storeName = nameEl.value.trim();
    if (statusEl) settings.storeStatus = statusEl.value;
    if (announceEl && announceEl.value.trim()) settings.announcementText = announceEl.value.trim();

    saveData('settings', settings);
    updateBrandLogos();
    updateCartUI();
    renderAdminDashboard();
    showToast('Store settings saved successfully!');
  }

  function resetAllData() {
    if (!confirm('Reset all menu items, slides, categories, and settings back to defaults?')) return;
    localStorage.clear();
    settings = { ...DEFAULT_SETTINGS };
    categories = [...DEFAULT_CATEGORIES];
    heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    menuItems = [...DEFAULT_MENU_ITEMS];
    branches = [...DEFAULT_BRANCHES];
    reviews = [...DEFAULT_REVIEWS];
    zones = [...DEFAULT_ZONES];
    promos = [...DEFAULT_PROMOS];
    orders = [...DEFAULT_ORDERS];
    cart = [];

    updateBrandLogos();
    renderCategories();
    renderMenu();
    renderHeroSlide(0);
    renderReviews();
    renderBranches();
    updateCartUI();
    renderAdminDashboard();
    renderAdminOrders();
    renderAdminMenuItems();
    renderAdminCoupons();
    renderAdminZones();
    renderAdminCategories();
    renderAdminHeroSlides();
    renderAdminBranches();
    renderAdminSettings();
    showToast('All data reset to factory defaults!');
  }

  // --- Customer Review Submission ---
  function submitReview() {
    const nameEl = document.getElementById('review-form-name');
    const locEl = document.getElementById('review-form-loc');
    const commentEl = document.getElementById('review-form-comment');
    const ratingEl = document.getElementById('review-form-rating');

    const name = nameEl ? nameEl.value.trim() : '';
    const loc = locEl ? locEl.value.trim() : 'Lahore';
    const comment = commentEl ? commentEl.value.trim() : '';
    const rating = ratingEl ? parseInt(ratingEl.value, 10) : 5;

    if (!name || !comment) {
      showToast('Please provide your name and review', 'error');
      return;
    }

    reviews.unshift({
      id: Date.now(),
      name,
      location: loc,
      rating,
      date: 'Just now',
      comment
    });

    saveData('reviews', reviews);
    renderReviews();

    if (nameEl) nameEl.value = '';
    if (commentEl) commentEl.value = '';

    const modal = document.getElementById('review-modal');
    if (modal) modal.classList.add('hidden');

    showToast('Thank you for reviewing LFC!');
  }

  // --- URL Hash Listener for Admin Access: #admin, #admin-login, #adminpanel, ?admin=true, /admin ---
  function checkAdminUrlHash() {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const pathname = (window.location.pathname || '').toLowerCase();
    if (
      hash === '#admin' ||
      hash === '#admin-login' ||
      hash === '#adminlogin' ||
      hash === '#adminpanel' ||
      hash === '#admin-panel' ||
      hash === '#adminlfc1' ||
      hash === '#5640' ||
      hash === '#lfcadmin' ||
      search.includes('admin') ||
      search.includes('5640') ||
      pathname.endsWith('/admin')
    ) {
      openAdminModal();
    }
  }

  // --- Scroll & Motion Enhancements ---
  function initScrollEffects() {
    const progress = document.getElementById('scroll-progress');
    const header = document.getElementById('site-header');
    const backToTop = document.getElementById('back-to-top');
    const revealEls = document.querySelectorAll('.reveal');

    function onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (header) header.classList.toggle('is-scrolled', scrollTop > 12);
      if (backToTop) backToTop.classList.toggle('show', scrollTop > 500);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('in-view'));
    }
  }

  function initStatsCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => obs.observe(c));
    } else {
      counters.forEach(animate);
    }
  }

  // --- Initialization ---
  function init() {
    updateBrandLogos();
    renderHeroSlide(0);
    startHeroTimer();
    startLiveOrderTicker();
    renderCategories();
    renderMenu();
    renderReviews();
    renderBranches();
    updateCartUI();
    updateOrderTypeUI();
    initScrollEffects();
    initStatsCounters();

    // Search Listeners
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
      });
    }

    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
      });
    }

    // Check URL hash for admin access
    checkAdminUrlHash();
    window.addEventListener('hashchange', checkAdminUrlHash);
    window.addEventListener('popstate', checkAdminUrlHash);

    // Keyboard shortcuts: Alt+A or Ctrl+Shift+L opens admin; ESC closes overlays
    window.addEventListener('keydown', (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l')) {
        e.preventDefault();
        openAdminModal();
        return;
      }
      if (e.key === 'Escape') {
        closeCartDrawer();
        closeAdminModal();
        closeCustomizeModal();
        closeReceiptModal();
        closeEditItemModal();
        if (typeof closeReviewModal === 'function') {
          closeReviewModal();
        }
      }
    });

    setInterval(syncRemoteData, 15000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncRemoteData();
    });
  }

  // --- Window Controller Export ---
  window.LFC = {
    addToCart,
    addToCartById,
    openCustomizeModal,
    closeCustomizeModal,
    selectCustomizeSize,
    selectCustomizeSpice,
    toggleCustomizeAddon,
    stepCustomizeQty,
    confirmCustomizedItem,
    changeDeliveryZone,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    openCartDrawer,
    closeCartDrawer,
    applyPromoCode,
    checkoutViaWhatsApp,
    setOrderType,
    clearSearch,
    setCategory: (catId) => {
      activeCategory = catId;
      renderCategories();
      renderMenu();
    },
    goToHeroSlide: (idx) => {
      renderHeroSlide(idx);
      startHeroTimer();
    },
    nextHeroSlide: () => {
      renderHeroSlide(activeSlideIndex + 1);
      startHeroTimer();
    },
    prevHeroSlide: () => {
      renderHeroSlide(activeSlideIndex - 1);
      startHeroTimer();
    },
    openAdminModal,
    closeAdminModal,
    submitAdminPin,
    changeAdminPin,
    switchAdminTab,
    filterOrders,
    searchAdminOrders,
    generateTestOrder,
    updateOrderStatus,
    exportOrdersCsv,
    clearCompletedOrders,
    openReceiptModal,
    closeReceiptModal,
    toggleStock,
    deleteMenuItem,
    addNewMenuItem,
    searchAdminMenu,
    openEditItemModal,
    closeEditItemModal,
    saveEditedMenuItem,
    addEditSizeRow,
    removeEditSizeRow,
    updateEditSizeName,
    updateEditSizePrice,
    addEditAddonRow,
    removeEditAddonRow,
    updateEditAddonName,
    updateEditAddonPrice,
    addNewPromoCode,
    togglePromoCode,
    deletePromoCode,
    addNewDeliveryZone,
    deleteDeliveryZone,
    updateStoreStatus,
    exportDataJson,
    importDataJson,
    addNewCategory,
    promptEditCategory,
    deleteCategory,
    setNewItemPhoto: (input) => {
      handlePhotoUpload(input, 'new-item-preview', (base64) => {
        tempNewItemImage = base64;
      });
    },
    updateHeroSlideField,
    uploadHeroSlidePhoto,
    downloadHeroPhoto, bulkPrice, bulkStock, publishAll, editItemPhoto, editItemUseArt, editItemUrl,
    addHeroSlide, duplicateHeroSlide, deleteHeroSlide, moveHeroSlide, toggleHeroSlide, resetHeroPhoto, resetHeroSlides, setHeroConfig, previewHeroSlide,
    heroOpen: (id, o) => (o ? adminHeroOpen.add(id) : adminHeroOpen.delete(id)),
    addNewBranch,
    deleteBranch,
    uploadCustomLogo,
    setLogoUrlManually,
    saveAdminSettings,
    resetAllData,
    submitReview,
    openReviewModal: () => {
      const modal = document.getElementById('review-modal');
      if (modal) modal.classList.remove('hidden');
    },
    closeReviewModal: () => {
      const modal = document.getElementById('review-modal');
      if (modal) modal.classList.add('hidden');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); syncRemoteData(); });
  } else {
    init();
    syncRemoteData();
  }
})();

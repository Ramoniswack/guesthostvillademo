// ─────────────────────────────────────────────────────────────
//  MENU DATA: edit prices here, no component changes needed.
//
//  Item fields:
//    name    (required)
//    price   number in NPR, OR leave out and use `options`, OR price: null → "Ask staff"
//    options [{ label, price, veg? }]   for size / style / variant pricing
//    desc    short description (optional)
//    veg     true = vegetarian, false = non-veg, omit = unknown / mixed (no marker)
//    pick    true = shows a "Chef's pick" tag (placeholders: choose your own!)
//    note    small italic note under the item (optional)
//
//  Structure: categories (the tabs) → groups (headings) → items.
// ─────────────────────────────────────────────────────────────

export const menuNote = 'Prices in NPR. Taxes/service charge may apply. Menu may change.'

export const categories = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    groups: [
      {
        title: 'Breakfast',
        items: [
          { name: 'Villa Special', price: 580, pick: true },
          { name: 'Sunny Morning Power', price: 420 },
          { name: 'Grilled sandwich with scrambled egg', price: 420 },
          { name: 'Masala omelet', price: 200 },
          { name: 'French toast', price: 280 },
          { name: 'Plain pancakes', price: 300 },
          { name: 'Pancakes with ice cream', price: 400 },
        ],
      },
      {
        title: 'Burgers & Sandwiches',
        items: [
          { name: 'Veg burger', price: 250, veg: true },
          { name: 'Chicken burger', price: 300, veg: false },
          { name: 'Chicken sandwich', price: 320, veg: false },
          { name: 'Veg sandwich', price: 250, veg: true },
          { name: 'Grilled chicken cheese sandwich', price: 450, veg: false },
          { name: 'Tuna sandwich', price: 420, veg: false },
          { name: 'Extra cheese', price: 100, desc: 'Add to any burger or sandwich (+NPR 100)' },
        ],
      },
    ],
  },

  {
    id: 'snacks',
    label: 'Snacks',
    groups: [
      {
        title: 'Veg Snacks',
        items: [
          { name: 'Aalu fry', price: 200, veg: true },
          { name: 'Aalu sadeko', price: 250, veg: true, desc: 'Spiced potato salad, Nepali style' },
          { name: 'Masala papad', price: 160, veg: true },
          { name: 'Jeera aalu', price: 220, veg: true },
          { name: 'Homemade fries', price: 260, veg: true },
          { name: 'Chips chilly', price: 300, veg: true },
          { name: 'Chau-chau sadeko', price: 220, veg: true },
          { name: 'Peanut sadeko', price: 250, veg: true },
          { name: 'Mushroom chilly', price: 280, veg: true },
          { name: 'Mushroom fry', price: 200, veg: true },
          { name: 'Paneer fries', price: 350, veg: true },
          { name: 'Paneer chilly', price: 420, veg: true },
          { name: 'Pakoda', price: 280, veg: true },
        ],
      },
      {
        title: 'Non-Veg Snacks',
        items: [
          { name: 'Pork sadeko', price: 460, veg: false },
          { name: 'Pork tawa', price: 500, veg: false },
          { name: 'Pork chilly', price: 480, veg: false },
          { name: 'Spicy pork', price: 480, veg: false },
          { name: 'Chicken sadeko', price: 480, veg: false },
          { name: 'Chicken lolly', price: 460, veg: false },
          { name: 'Spicy chicken legs', price: 450, veg: false },
          { name: 'Honey garlic chicken wings', price: 480, veg: false },
          { name: 'Chicken meatballs', price: 360, veg: false },
          { name: 'Sausage fry', price: 250, veg: false },
          { name: 'Buff sadeko', price: 420, veg: false },
          { name: 'Buff chilly', price: 460, veg: false },
        ],
      },
      {
        title: 'House Specials',
        items: [
          { name: 'Aloo sticks', price: 120, veg: true },
          { name: 'Chicken kurkure', price: 450, veg: false },
          { name: 'Chicken chad-chad sadeko', price: 320, veg: false },
          { name: 'Crunchy momo', price: 380, pick: true },
          {
            name: 'Crispy fried chicken',
            veg: false,
            pick: true,
            options: [
              { label: '2 pcs', price: 280 },
              { label: 'Half', price: 700 },
              { label: 'Full', price: 1350 },
            ],
          },
          { name: 'Chicken pakauda', price: 400, veg: false },
          { name: 'Fish & chips', price: 500, veg: false },
          { name: 'Ramen noodles', price: 580 },
          { name: 'Whole grilled fish', price: 700, veg: false },
        ],
      },
    ],
  },

  {
    id: 'momo',
    label: 'Momo',
    groups: [
      {
        title: 'Momo',
        note: 'Handmade dumplings, pick your style.',
        items: [
          {
            name: 'Chicken / Buff Momo',
            veg: false,
            options: [
              { label: 'Steamed', price: 260 },
              { label: 'Fried', price: 280 },
              { label: 'Sadeko', price: 300 },
              { label: 'Jhol', price: 300 },
              { label: 'Chilly', price: 350 },
            ],
          },
          {
            name: 'Veg Momo',
            veg: true,
            options: [
              { label: 'Steamed', price: 200 },
              { label: 'Fried', price: 220 },
              { label: 'Jhol', price: 250 },
              { label: 'Chilly', price: 280 },
              { label: 'Sadeko', price: 300 },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'newari',
    label: 'Newari',
    groups: [
      {
        title: 'Newari',
        items: [
          { name: 'Gravy sukuti chiura', price: 420, veg: false, desc: 'Dried meat in gravy with beaten rice' },
          { name: 'Bhatmas sadeko', price: 250, veg: true, desc: 'Spiced roasted soybeans' },
          {
            name: 'Choila',
            veg: false,
            desc: 'Spiced Newari grilled-meat salad',
            options: [
              { label: 'Chicken', price: 420 },
              { label: 'Buff', price: 420 },
            ],
          },
          { name: 'Newari set', price: 550, pick: true },
        ],
      },
    ],
  },

  {
    id: 'mains',
    label: 'Mains',
    groups: [
      {
        title: 'Mains',
        items: [
          {
            name: 'Thali set',
            desc: 'A full plate with dal, rice and sides',
            options: [
              { label: 'Chicken', price: 550 },
              { label: 'Veg', price: 550, veg: true },
              { label: 'Fish', price: 550 },
            ],
          },
          {
            name: 'Newari platter',
            veg: false,
            options: [
              { label: 'Chicken', price: 550 },
              { label: 'Buff', price: 550 },
            ],
          },
          { name: 'Roti', price: 45, veg: true },
          { name: 'Plain rice', price: 120, veg: true },
          { name: 'Tadka dal', price: 360, veg: true },
          { name: 'Chicken butter masala', price: 520, veg: false },
          { name: 'Kadhai chicken', price: 480, veg: false },
          { name: 'Sekuwa chicken', price: 450, veg: false, pick: true, desc: 'Marinated, grilled chicken' },
          { name: 'Honey garlic lemon chicken', price: 550, veg: false },
        ],
      },
      {
        title: 'Chowmein, Fried Rice & Thukpa',
        note: 'Same price whichever you choose. Pick Veg, Egg, Buff, Chicken or Mixed.',
        items: [
          { name: 'Chowmein', options: noodleOptions() },
          { name: 'Fried rice', options: noodleOptions() },
          { name: 'Thukpa', desc: 'Himalayan noodle soup', options: noodleOptions() },
        ],
      },
      {
        title: 'Soups & Salads',
        items: [
          { name: 'Chicken creamy soup', price: 350, veg: false },
          { name: 'Chicken soup', price: 320, veg: false },
          { name: 'Mushroom soup', price: 280, veg: true },
          { name: 'Hot & sour soup', price: 350 },
          { name: 'Mixed fruit salad', price: 420, veg: true },
          { name: 'Chicken salad', price: 480, veg: false },
          { name: 'Green salad', price: 280, veg: true },
          {
            name: 'Sushi',
            desc: 'Made on request, about 40 minutes',
            options: [
              { label: 'Tuna', price: 620 },
              { label: 'Chicken', price: 620 },
              { label: 'Veg', price: 620, veg: true },
            ],
          },
        ],
      },
      {
        title: 'Desserts',
        items: [
          { name: 'Ice cream', price: 250, veg: true },
          { name: 'Mixed fruit with yoghurt', price: 450, veg: true },
          { name: 'Fried ice cream', price: 400, veg: true },
        ],
      },
    ],
  },

  {
    id: 'pizza',
    label: 'Pizza & Pasta',
    groups: [
      {
        title: 'Pasta',
        items: [
          { name: 'House pasta', price: 280 },
          { name: 'Creamy mushroom chicken pasta', price: 550, veg: false },
          { name: 'Meat-sauce pasta', price: 480, veg: false },
        ],
      },
      {
        title: 'Pizza',
        items: [
          { name: 'Margherita', price: 460, veg: true },
          { name: 'Meat Lovers', price: 620, veg: false },
          { name: 'Mushroom', price: 480, veg: true },
          { name: 'Spicy chicken', price: 520, veg: false },
          { name: 'Pepperoni', price: 500, veg: false },
          { name: 'Extra cheese', price: 100, desc: 'Add to any pizza (+NPR 100)' },
        ],
      },
    ],
  },

  {
    id: 'platters',
    label: 'Platters',
    groups: [
      {
        title: 'Sharing Platters',
        note: 'Ask staff how many people it serves.',
        items: [
          { name: 'Momo platter', price: 580, pick: true },
          { name: 'Meat Lovers platter', price: 1500, veg: false },
          { name: 'Veg platter', price: 1200, veg: true },
          { name: 'Pork platter', price: 1500, veg: false },
        ],
      },
    ],
  },

  {
    id: 'drinks',
    label: 'Drinks',
    groups: [
      {
        title: 'Cold & Soft Drinks',
        items: [
          { name: 'Coke / Sprite', price: 120, veg: true },
          { name: 'Water', price: 60, veg: true },
          { name: 'Fresh juice', price: 350, veg: true },
          { name: 'Red Bull', price: 290, veg: true },
        ],
      },
      {
        title: 'Milkshakes & Lassi',
        items: [
          {
            name: 'Milkshake',
            veg: true,
            options: [
              { label: 'Oreo', price: 350 },
              { label: 'KitKat', price: 360 },
              { label: 'Strawberry', price: 260 },
              { label: 'Vanilla', price: 260 },
              { label: 'Chocolate', price: 260 },
            ],
          },
          {
            name: 'Lassi',
            veg: true,
            options: [
              { label: 'Sweet', price: 250 },
              { label: 'Banana', price: 280 },
            ],
          },
        ],
      },
      {
        title: 'Cold Coffee',
        items: [
          {
            name: 'Cold coffee',
            veg: true,
            options: [
              { label: 'With ice cream', price: 380 },
              { label: 'Regular', price: 280 },
              { label: 'Honey lime', price: 280 },
              { label: 'Coffee lemonade', price: 300 },
            ],
          },
        ],
      },
      {
        title: 'Hot Drinks',
        items: [
          { name: 'Black tea', price: 55, veg: true },
          { name: 'Lemon tea', price: 80, veg: true },
          { name: 'Milk tea', price: 100, veg: true },
          { name: 'Masala tea', price: 160, veg: true },
          { name: 'Black coffee', price: 160, veg: true },
          { name: 'Milk coffee', price: 180, veg: true },
          { name: 'Hot lemon honey', price: 250, veg: true },
          { name: 'Hot chocolate', price: 300, veg: true },
        ],
      },
    ],
  },

  {
    id: 'bar',
    label: 'Bar',
    groups: [
      {
        title: 'Beer',
        items: [
          { name: 'Gorkha Strong / Premium', price: 700 },
          { name: 'Tuborg', price: 730 },
          { name: 'Tuborg Mini', price: 380 },
          { name: 'Tuborg can', price: 460 },
        ],
      },
      {
        title: 'Wine',
        items: [
          {
            name: 'JP Chenet / Robertson',
            options: [
              { label: 'Glass', price: 680 },
              { label: 'Bottle', price: 3500 },
            ],
          },
          {
            name: 'Kings Hill / Big Master',
            options: [
              { label: 'Glass', price: 480 },
              { label: 'Bottle', price: 2600 },
            ],
          },
        ],
      },
      {
        title: 'Shisha',
        items: [
          {
            name: 'Shisha',
            options: [
              { label: 'Small', price: 500 },
              { label: 'Large', price: 700 },
            ],
          },
        ],
      },
      {
        title: 'Spirits & Coolers',
        items: [{ name: 'Spirits & coolers', price: null, note: "Ask our staff for today's prices." }],
      },
    ],
  },
]

function noodleOptions() {
  return [
    { label: 'Veg', price: 220, veg: true },
    { label: 'Egg', price: 250 },
    { label: 'Buff', price: 260 },
    { label: 'Chicken', price: 280 },
    { label: 'Mixed', price: 300 },
  ]
}

/** Number of distinct menu items (used by the "dishes & drinks" stat). */
export const menuItemCount = categories.reduce(
  (n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0),
  0
)

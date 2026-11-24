// ─────────────────────────────────────────────────────────────
//  PACKAGES DATA: Shared by /packages and /packages/[slug]
// ─────────────────────────────────────────────────────────────

export const packages = [
  {
    id: 'couple',
    label: 'For two',
    badge: 'Couple stay',
    popular: false,
    title: 'A quiet couple escape',
    intro: 'A warm private room, breakfast for two and wide hilltop views above Pokhara.',
    description:
      'Designed for couples seeking quiet mornings above the valley mist. Stay in our Crystal Pyramid Dome House with panoramic mountain or city views, daily breakfast for two, and unhurried evenings at the pyramid restro and bottle bar.',
    price: 'From NPR 6,800',
    note: 'per night · 1–2 adults',
    guestsRange: '1–2 guests (up to 4)',
    defaultGuests: '2',
    spaceLabel: '1-BHK Private Room · Pyramid Building',
    mealsLabel: 'Daily breakfast included',
    image: '/images/room-couple.webp',
    video: '/videos/hero-pool.mp4',
    gallery: [
      '/images/room-couple.webp',
      '/images/pyramid.webp',
      '/images/room-deluxe.webp',
      '/images/night-aerial.webp',
    ],
    included: [
      'Private Mountain View or City View room in the Pyramid Building',
      'Complimentary daily breakfast for two at the pyramid restro',
      'Panoramic valley, garden & Himalayan skyline views',
      'Attached bathroom with 24/7 hot water & fresh toiletries',
      'Free high-speed Wi-Fi & secure on-site parking',
    ],
    extra: [
      'Candlelight dinner or wood-fired pizza night at the pyramid',
      'Anniversary or birthday room decoration on request',
      'MAP meal plan upgrade (+NPR 550 per person)',
    ],
    itinerary: [
      {
        time: 'Afternoon · From 2:00 PM',
        title: 'Arrive & settle into the dome house',
        text: 'Check in above the city noise, drop your bags, and enjoy tea or coffee with wide hilltop views.',
      },
      {
        time: 'Evening · Sunset to 10:00 PM',
        title: 'Dinner & drinks over Pokhara city lights',
        text: 'Order handmade momo, grilled sekuwa, or wood-fired pizza at the pyramid restro & bottle bar.',
      },
      {
        time: 'Morning · 7:00 AM – 10:30 AM',
        title: 'Mountain sunrise & fresh breakfast',
        text: 'Wake up to clear Annapurna & Machapuchare views followed by a freshly cooked breakfast for two.',
      },
    ],
    roomSlugs: ['mountain-view-room', 'city-view-room'],
  },
  {
    id: 'family',
    label: 'For groups',
    badge: 'Most popular',
    popular: true,
    title: 'A weekend with your people',
    intro: 'Bring family or friends for a private villa wing with room to gather, eat and slow down.',
    description:
      'Ideal for families and close friend groups of 4 to 12 guests. Take over a multi-bedroom villa wing or the entire Pyramid Dome House with shared living spaces, private terraces, welcome drinks, and daily breakfast.',
    price: 'From NPR 1,550',
    note: 'per person · 4–12 guests',
    guestsRange: '4–12 guests',
    defaultGuests: '8',
    spaceLabel: 'Private Villa Wing or Full Dome (2–4 bedrooms)',
    mealsLabel: 'Welcome drink & daily breakfast',
    image: '/images/garden.webp',
    video: '/videos/hero-pool.mp4',
    gallery: [
      '/images/garden.webp',
      '/images/day-aerial.webp',
      '/images/pyramid.webp',
      '/images/room-deluxe.webp',
    ],
    included: [
      'Private multi-bedroom wing or 2-bedroom Pyramid Dome buyout',
      'Welcome drink on arrival & daily cooked breakfast for the group',
      'Shared living room, garden lawns & viewing terraces',
      'Attached bathrooms with 24/7 hot water',
      'Free high-speed Wi-Fi & private parking for cars/bikes',
    ],
    extra: [
      'Evening garden BBQ platter & bonfire setup',
      'MAP half-board meal plan (+NPR 550 per person)',
      'Newari or momo sharing platters for the table',
    ],
    itinerary: [
      {
        time: 'Day 1 · Afternoon',
        title: 'Welcome drinks & private wing check-in',
        text: 'Gather on the garden lawn with welcome drinks while everyone settles into their bedrooms.',
      },
      {
        time: 'Day 1 · Evening',
        title: 'Garden BBQ, platters & music',
        text: 'Pre-order a grilled meat or veg platter, gather around a warm bonfire, and relax under the stars.',
      },
      {
        time: 'Day 2 · Morning',
        title: 'Group breakfast at the pyramid',
        text: 'Enjoy a slow group breakfast overlooking the valley before heading out to Sarangkot or Lakeside.',
      },
    ],
    roomSlugs: ['pyramid-dome-house', 'villa-top-floor'],
  },
  {
    id: 'buyout',
    label: 'Private buyout',
    badge: '7-BHK estate',
    popular: false,
    title: 'The whole villa, yours',
    intro: 'Take over the entire G’Host estate for a celebration, retreat or reunion with space for everyone.',
    description:
      'Complete privacy across the entire hilltop estate for 12 to 24+ guests. Includes both the Main Villa and the Crystal Pyramid Dome House, private lawns, dedicated kitchen & hosting team, and flexible event setups.',
    price: 'From NPR 1,550',
    note: 'per person · 12–24 guests',
    guestsRange: '12–24+ guests',
    defaultGuests: '16',
    spaceLabel: 'Full 7-BHK Estate (Main Villa + Pyramid Building)',
    mealsLabel: 'Custom group dining & breakfast',
    image: '/images/pyramid.webp',
    video: '/videos/hero-pool.mp4',
    gallery: [
      '/images/pyramid.webp',
      '/images/night-aerial.webp',
      '/images/day-aerial.webp',
      '/images/garden.webp',
    ],
    included: [
      'Exclusive 7-BHK full estate buyout (Main Villa + Pyramid Dome)',
      'Dedicated on-site host, kitchen & housekeeping team',
      'Full access to garden lawns, terraces & pyramid dining hall',
      'Daily breakfast for all guests & flexible meal scheduling',
      'On-site parking for multiple vehicles & private group check-in',
    ],
    extra: [
      'Custom multi-course buffet or live BBQ station',
      'Celebration stage, flowers, cake & sound setup',
      'Full-day retreat tea/coffee & snack service',
    ],
    itinerary: [
      {
        time: 'Arrival · Custom schedule',
        title: 'Exclusive estate handover',
        text: 'Our team welcomes your group at the gate and coordinates room assignments across both buildings.',
      },
      {
        time: 'Main Event · Afternoon & Night',
        title: 'Celebration dinner, bonfire & private bar',
        text: 'Host your reunion, birthday, or retreat with custom menus from our pyramid kitchen and bottle bar.',
      },
      {
        time: 'Departure · Next morning',
        title: 'Unhurried group breakfast & farewell',
        text: 'Wrap up with breakfast on the terrace and flexible departure coordination for your group.',
      },
    ],
    roomSlugs: ['whole-villa', 'pyramid-dome-house', 'villa-top-floor'],
  },
]

export const extras = [
  {
    title: 'Breakfast at the pyramid',
    text: 'Start slowly with fresh breakfast and mountain air under the pyramid roof.',
    image: '/images/pyramid.webp',
  },
  {
    title: 'Garden BBQ & bonfire',
    text: 'Gather on the lawns for grilled platters, warm fire and valley lights.',
    image: '/images/garden.webp',
  },
  {
    title: 'Hilltop celebration setup',
    text: 'Flowers, custom dinner tables and flexible spaces for birthdays or retreats.',
    image: '/images/day-aerial.webp',
  },
]

export const packageFaqs = [
  {
    q: 'Do you require a deposit to confirm a package?',
    a: 'Small room stays are confirmed directly on WhatsApp with no advance payment. Group bookings and full-villa buyouts may require a small booking deposit once dates and menu are finalized.',
  },
  {
    q: 'Can we add extra beds or floor mattresses for larger groups?',
    a: 'Yes. Extra beds and floor mattresses are available for larger groups and families at NPR 1,500 per extra guest per night (or included in per-person group packages).',
  },
  {
    q: 'What about food for children?',
    a: 'We prepare mild, kid-friendly meals on request at the pyramid restro. Children sharing existing beds are priced on request or at reduced child rates for group packages.',
  },
  {
    q: 'Can you arrange birthday or anniversary decorations?',
    a: 'Yes—let us know your occasion in the enquiry form or on WhatsApp and our team can set up flowers, candles, cake or garden seating.',
  },
]

// ─────────────────────────────────────────────────────────────
//  STAYS: The G'Host Villa, Sarangkot, Pokhara
//
//  Two buildings:
//    • Pyramid Building  (Crystal Pyramid Dome House: 2 bedrooms = MV room + CV room)
//    • Main Villa        (Villa Top 2BHK floor, Suite section, Group section)
//
//  MV = mountain view · CV = city view · BB = bed & breakfast · MAP = meal plan
//
//  Prices, extra-guest rules and "which stays to suggest for which group size"
//  all come from the owner's handwritten booking notes. Edit numbers HERE only.
// ─────────────────────────────────────────────────────────────

export const MAP_ADD = 550 // NPR per person, added to the BB rate when MAP is chosen
export const MAX_GUESTS = 30

export const buildings = [
  {
    id: 'pyramid',
    name: 'Pyramid Building',
    tagline: 'Crystal Pyramid Dome House',
    image: '/images/pyramid.webp',
    position: '50% 60%',
    blurb: 'A two-bedroom dome house with a mountain-view room and a city-view room. Book one room or the whole dome.',
  },
  {
    id: 'villa',
    name: 'Main Villa',
    tagline: 'Villa Top · Suite · Group Section',
    image: '/images/day-aerial.webp',
    position: '50% 62%',
    blurb: 'The main house: a 2BHK top floor, a suite and a private group section. Book a floor, a section or the whole villa.',
  },
]

export const plans = [
  { id: 'BB', short: 'BB', label: 'Bed & Breakfast', note: 'Breakfast included' },
  { id: 'MAP', short: 'MAP', label: 'Meal plan', note: `+ NPR ${MAP_ADD} per person` },
]

const COMMON_FEATURES = [
  'Free high-speed Wi-Fi',
  'Attached bathroom with hot water',
  'Breakfast included on the BB plan',
  'Access to the pyramid restro & bottle bar',
]

// PLACEHOLDER PHOTOS: swap each `image` / `gallery` for the real room photo when you have it.
export const rooms = [
  {
    id: 'mountain-view-room',
    name: 'Mountain View Room',
    code: 'MV',
    building: 'pyramid',
    kind: 'room',
    catalog: true,
    views: ['mountain'],
    viewText: 'Mountain view (MV)',
    bhk: '1 bedroom · Pyramid Building',
    bed: 'Double bed',
    capacity: '2 guests · up to 4',
    minGuests: 1, maxGuests: 4, defaultGuests: 2,
    pricing: { type: 'base+extra', base: 7200, included: 2, extra: 1500 },
    price: 7200, rateType: 'per night',
    badge: 'Mountain view',
    image: '/images/room-couple.webp',
    gallery: ['/images/room-couple.webp', '/images/pyramid.webp', '/images/room-deluxe.webp', '/images/hero.webp'],
    alt: 'Mountain View Room with a double bed, red throw and a large window',
    blurb: 'A bright room in the Crystal Pyramid Dome House, facing the mountains. Made for couples, with room for up to four guests.',
    bestFor: 'Couples, or a small group of up to four who want the mountain view.',
    features: [...COMMON_FEATURES, 'Mountain view from the room', 'Sleeps 2, extra guests up to 4 at NPR 1,500 each'],
  },
  {
    id: 'city-view-room',
    name: 'City View Room',
    code: 'CV',
    building: 'pyramid',
    kind: 'room',
    catalog: true,
    views: ['city'],
    viewText: 'City view (CV)',
    bhk: '1 bedroom · Pyramid Building',
    bed: 'Double bed',
    capacity: '2 guests · up to 4',
    minGuests: 1, maxGuests: 4, defaultGuests: 2,
    pricing: { type: 'base+extra', base: 5800, included: 2, extra: 1500 },
    price: 5800, rateType: 'per night',
    badge: 'Best value',
    image: '/images/room-deluxe.webp',
    gallery: ['/images/room-deluxe.webp', '/images/pyramid.webp', '/images/room-couple.webp', '/images/hero.webp'],
    alt: 'City View Room with a double bed, red runner, wooden floor and a carved mirror',
    blurb: 'A warm, wood-floored room in the Pyramid Building looking over Pokhara city. The lower-priced way to stay in the dome house.',
    bestFor: 'Couples and small groups who want the Pyramid Building at the friendliest price.',
    features: [...COMMON_FEATURES, 'City view from the room', 'Sleeps 2, extra guests up to 4 at NPR 1,500 each'],
  },
  {
    id: 'pyramid-dome-house',
    name: 'Entire Pyramid Dome House',
    code: 'MV + CV',
    building: 'pyramid',
    kind: 'house',
    catalog: true,
    views: ['mountain', 'city'],
    viewText: 'Mountain & city view (MV + CV)',
    bhk: '2 bedrooms · Pyramid Building',
    bed: 'Both bedrooms (MV + CV)',
    capacity: '4 guests · up to 7',
    minGuests: 4, maxGuests: 7, defaultGuests: 4,
    pricing: { type: 'base+extra', base: 13000, included: 4, extra: 1500 },
    price: 13000, rateType: 'per night',
    badge: 'Private dome house',
    image: '/images/pyramid.webp',
    gallery: ['/images/pyramid.webp', '/images/hero.webp', '/images/room-couple.webp', '/images/room-deluxe.webp'],
    alt: 'The crystal pyramid dome house with Machapuchare and the Himalayan range behind it',
    blurb: 'Take both bedrooms of the Crystal Pyramid Dome House, the mountain-view room and the city-view room, as one private stay.',
    bestFor: 'Two couples or a group of 4 to 7 who want a whole building to themselves.',
    includes: ['mountain-view-room', 'city-view-room'],
    features: [...COMMON_FEATURES, 'Both bedrooms: Mountain View + City View', 'The whole Pyramid Building for your group', 'Sleeps 4, extra guests up to 7 at NPR 1,500 each'],
  },
  {
    id: 'suite',
    name: 'Suite',
    code: 'Suite',
    building: 'villa',
    kind: 'room',
    catalog: true,
    views: [],
    viewText: '',
    bhk: 'Suite section · Main Villa',
    bed: '2 rooms + mini single bedroom',
    capacity: '2 guests · up to 4',
    minGuests: 1, maxGuests: 4, defaultGuests: 2,
    pricing: { type: 'base+extra', base: 4500, included: 2, extra: 1500 },
    price: 4500, rateType: 'per night',
    badge: 'Lowest price',
    image: '/images/garden.webp',
    gallery: ['/images/garden.webp', '/images/hero.webp', '/images/day-aerial.webp', '/images/room-deluxe.webp'],
    alt: 'Garden and entrance of the Main Villa at G’Host Villa',
    blurb: 'A roomy suite on the ground floor of the Main Villa, with two rooms and a mini single bedroom. Sleeps two, and up to four.',
    bestFor: 'Couples and small families who want space at the lowest rate.',
    features: [...COMMON_FEATURES, '2 rooms plus a mini single bedroom', 'Queen-size bed', 'Sleeps 2, extra guests up to 4 at NPR 1,500 each'],
  },
  {
    id: 'group-section',
    name: 'Private Group Section',
    code: 'Group',
    building: 'villa',
    kind: 'section',
    catalog: true,
    views: [],
    viewText: '',
    bhk: '3 bedrooms · Main Villa',
    bed: '3 bedrooms, 2 guests each',
    capacity: '4 – 8 guests',
    minGuests: 4, maxGuests: 8, defaultGuests: 4,
    pricing: { type: 'perPerson', rate: 1550 },
    price: 1550, rateType: 'per person',
    badge: 'Priced per person',
    image: '/images/day-aerial.webp',
    gallery: ['/images/day-aerial.webp', '/images/garden.webp', '/images/hero.webp', '/images/night-aerial.webp'],
    alt: 'Aerial view of the Main Villa and pyramid building among the trees',
    blurb: 'A private section of the Main Villa for friends and family. Pay per person, and take any two bedrooms for four or all three for six.',
    bestFor: 'Friends and families of 4 to 8 who want to split the cost.',
    features: [...COMMON_FEATURES, 'Three bedrooms, any two for a group of 4', 'NPR 1,550 per person (NPR 3,100 per bedroom of two)', 'Comfortable for 6 to 7, up to 8 guests'],
  },
  {
    id: 'villa-top-floor',
    name: 'Villa Top (Entire 2BHK Top Floor)',
    code: 'Villa Top',
    building: 'villa',
    kind: 'floor',
    catalog: true,
    views: [],
    viewText: '',
    bhk: '2BHK top floor · Main Villa',
    bed: '2 interlocking bedrooms',
    capacity: '2 guests · up to 6',
    minGuests: 2, maxGuests: 6, defaultGuests: 2,
    pricing: { type: 'tiers', tiers: [{ upTo: 2, min: 8500, max: 10000 }, { upTo: 4, min: 12000, max: 12500 }] },
    price: 8500, rateType: 'per night',
    badge: 'Entire top floor',
    image: '/images/hero.webp',
    gallery: ['/images/hero.webp', '/images/day-aerial.webp', '/images/garden.webp', '/images/night-aerial.webp'],
    alt: 'The Main Villa and pyramid building seen from above',
    blurb: 'The whole top floor of the Main Villa: two interlocking bedrooms, a hall with dining, a kitchen and a balcony, all to yourselves.',
    bestFor: 'Families and friends of 2 to 6 who want a private floor with its own kitchen.',
    features: ['2 interlocking bedrooms', 'Living-area bed and sun bed', 'Hall-cum-dining and a kitchen', 'Private balcony', ...COMMON_FEATURES, 'Standard capacity 4, up to 6 with extra mattresses'],
  },
  {
    id: 'ground-floor',
    name: 'Entire Ground Floor',
    code: 'Suite + Group',
    building: 'villa',
    kind: 'floor',
    catalog: true,
    whatsappOnly: true,
    views: [],
    viewText: '',
    bhk: 'Suite + group section · Main Villa',
    bed: 'Suite + private group section',
    capacity: '8 – 12 guests',
    minGuests: 8, maxGuests: 12, defaultGuests: 8,
    pricing: { type: 'ask' },
    price: null, rateType: 'on WhatsApp',
    badge: 'Whole ground floor',
    image: '/images/garden.webp',
    gallery: ['/images/garden.webp', '/images/day-aerial.webp', '/images/hero.webp', '/images/night-aerial.webp'],
    alt: 'Garden lawn and ground floor of the Main Villa',
    blurb: 'The suite and the private group section together: the entire ground floor of the Main Villa for a bigger group.',
    bestFor: 'Groups of 8 to 12 who want a floor of their own.',
    includes: ['suite', 'group-section'],
    features: [...COMMON_FEATURES, 'Suite and private group section together', 'Extra beds placed for bigger groups', 'Price confirmed directly on WhatsApp'],
  },
  {
    id: 'villa-top-plus-suite',
    name: 'Villa Top + Suite',
    code: 'Villa Top + Suite',
    building: 'villa',
    kind: 'combo',
    catalog: false,
    whatsappOnly: true,
    views: [],
    viewText: '',
    bhk: 'Top floor + suite · Main Villa',
    bed: 'Villa top (max 6) + suite (max 4)',
    capacity: '8 – 10 guests',
    minGuests: 8, maxGuests: 10, defaultGuests: 8,
    pricing: { type: 'ask' },
    price: null, rateType: 'on WhatsApp',
    badge: 'Combination stay',
    image: '/images/hero.webp',
    gallery: ['/images/hero.webp', '/images/day-aerial.webp', '/images/garden.webp', '/images/night-aerial.webp'],
    alt: 'The Main Villa seen from above',
    blurb: 'The 2BHK top floor plus the suite, so a group of 8 to 10 stays together in the Main Villa.',
    bestFor: 'Groups of 8 to 10.',
    includes: ['villa-top-floor', 'suite'],
    features: [...COMMON_FEATURES, 'Villa top (up to 6 guests) and suite (up to 4 guests)', 'Extra floor mattresses available for larger groups', 'Price confirmed directly on WhatsApp'],
  },
  {
    id: 'villa-top-plus-group-section',
    name: 'Villa Top + Private Group Section',
    code: 'Villa Top + Group',
    building: 'villa',
    kind: 'combo',
    catalog: false,
    whatsappOnly: true,
    views: [],
    viewText: '',
    bhk: 'Top floor + group section · Main Villa',
    bed: 'Villa top + 3-bedroom group section',
    capacity: '9 – 12 guests',
    minGuests: 9, maxGuests: 12, defaultGuests: 9,
    pricing: { type: 'ask' },
    price: null, rateType: 'on WhatsApp',
    badge: 'Combination stay',
    image: '/images/day-aerial.webp',
    gallery: ['/images/day-aerial.webp', '/images/hero.webp', '/images/garden.webp', '/images/night-aerial.webp'],
    alt: 'Aerial view of the Main Villa and pyramid building',
    blurb: 'The entire 2BHK top floor with the private group section, for groups of 9 to 12.',
    bestFor: 'Groups of 9 to 12.',
    includes: ['villa-top-floor', 'group-section'],
    features: [...COMMON_FEATURES, 'Entire top floor plus the private group section', 'Price confirmed directly on WhatsApp'],
  },
  {
    id: 'whole-villa',
    name: 'Whole Villa (7BHK)',
    code: 'Whole villa',
    building: 'villa',
    kind: 'villa',
    catalog: true,
    whatsappOnly: true,
    views: [],
    viewText: '',
    bhk: '7BHK + 1 mini single bedroom · Main Villa',
    bed: '7 bedrooms + 1 mini single bedroom',
    capacity: '12 – 24 guests',
    minGuests: 12, maxGuests: 24, defaultGuests: 12,
    pricing: { type: 'ask' },
    price: null, rateType: 'on WhatsApp',
    badge: 'Exclusive use',
    image: '/images/night-aerial.webp',
    gallery: ['/images/night-aerial.webp', '/images/day-aerial.webp', '/images/hero.webp', '/images/garden.webp'],
    alt: 'G’Host Villa glowing at dusk in the green hills above Pokhara',
    blurb: 'The entire Main Villa for yourselves: the top floor, the suite and the group section, 7 bedrooms plus a mini single bedroom.',
    bestFor: 'Reunions, celebrations and retreats of 12 or more.',
    includes: ['villa-top-floor', 'suite', 'group-section'],
    features: [...COMMON_FEATURES, 'Top floor, suite and group section, all yours', 'Extra floor mattresses for the biggest groups', 'Price confirmed directly on WhatsApp'],
  },
  {
    id: 'whole-villa-plus-pyramid',
    name: 'Whole Villa + Pyramid Building',
    code: 'Whole villa + MV + CV',
    building: 'both',
    kind: 'combo',
    catalog: false,
    whatsappOnly: true,
    views: ['mountain', 'city'],
    viewText: 'Mountain & city view (MV + CV)',
    bhk: 'Whole villa + both dome-house rooms',
    bed: 'Whole villa + MV room + CV room',
    capacity: '15 – 30 guests',
    minGuests: 15, maxGuests: 30, defaultGuests: 15,
    pricing: { type: 'ask' },
    price: null, rateType: 'on WhatsApp',
    badge: 'The whole property',
    image: '/images/hero.webp',
    gallery: ['/images/hero.webp', '/images/night-aerial.webp', '/images/pyramid.webp', '/images/day-aerial.webp'],
    alt: 'The Main Villa and the pyramid building together',
    blurb: 'Both buildings, exclusively yours: the whole Main Villa plus the mountain-view and city-view rooms of the Pyramid Building.',
    bestFor: 'The biggest groups, 15 and above.',
    includes: ['whole-villa', 'mountain-view-room', 'city-view-room'],
    features: [...COMMON_FEATURES, 'The whole villa plus MV and CV rooms', 'Extra floor mattresses available', 'Price confirmed directly on WhatsApp'],
  },
]

export const findStay = (id) => rooms.find((room) => room.id === id)
export const buildingOf = (room) => (room.building === 'both' ? null : buildings.find((item) => item.id === room.building))
export const buildingLabel = (room) => (room.building === 'both' ? 'Both buildings' : buildingOf(room).name)

export const formatNpr = (value) => `NPR ${Math.round(value).toLocaleString('en-US')}`

// ── Which stays to suggest for each group size (from the owner's notes) ──
export function recommendedFor(guests) {
  let ids
  if (guests <= 3) ids = ['mountain-view-room', 'city-view-room', 'suite']
  else if (guests === 4) ids = ['pyramid-dome-house', 'mountain-view-room', 'city-view-room', 'suite', 'group-section', 'villa-top-floor']
  else if (guests === 5) ids = ['pyramid-dome-house', 'group-section', 'villa-top-floor']
  else if (guests === 6) ids = ['pyramid-dome-house', 'group-section', 'villa-top-floor', 'villa-top-plus-suite']
  else if (guests === 7) ids = ['pyramid-dome-house', 'group-section', 'villa-top-plus-suite']
  else if (guests === 8) ids = ['villa-top-plus-suite', 'ground-floor']
  else if (guests <= 10) ids = ['villa-top-plus-suite', 'ground-floor', 'villa-top-plus-group-section']
  else if (guests === 11) ids = ['ground-floor', 'villa-top-plus-group-section']
  else if (guests === 12) ids = ['villa-top-plus-group-section', 'ground-floor', 'whole-villa']
  else if (guests <= 14) ids = ['whole-villa']
  else ids = ['whole-villa', 'whole-villa-plus-pyramid']
  return ids.map(findStay).filter((room) => guests <= room.maxGuests)
}

// Groups of 8+ are booked directly on WhatsApp
export const WHATSAPP_FROM = 8

// ── Price for one stay ──
// returns { kind: 'ask' } | { kind: 'exact', total, perPerson } | { kind: 'range', min, max }
export function priceFor(room, guests, plan = 'BB') {
  const g = Math.min(Math.max(guests ?? room.defaultGuests, room.minGuests), room.maxGuests)
  const map = plan === 'MAP' ? MAP_ADD * g : 0
  const rule = room.pricing
  if (room.whatsappOnly || rule.type === 'ask') return { kind: 'ask', guests: g }
  if (rule.type === 'tiers') {
    const tier = rule.tiers.find((item) => g <= item.upTo)
    if (!tier) return { kind: 'ask', guests: g }
    return { kind: 'range', min: tier.min + map, max: tier.max + map, guests: g }
  }
  const base = rule.type === 'perPerson' ? rule.rate * g : rule.base + Math.max(0, g - rule.included) * rule.extra
  const total = base + map
  return { kind: 'exact', total, perPerson: Math.round(total / g), guests: g }
}

/** Text for a price block. guests = null means "show the from-price". */
export function describePrice(room, guests, plan = 'BB') {
  const result = priceFor(room, guests, plan)
  const label = guests == null ? 'From' : 'Total'
  const planTag = plan === 'MAP' ? ' · MAP' : ''
  if (result.kind === 'ask') return { label: '', main: 'Price on WhatsApp', note: 'Confirmed directly with the villa team', perPerson: null }
  if (result.kind === 'range') {
    return { label, main: `${formatNpr(result.min)} – ${result.max.toLocaleString('en-US')}`, note: `per night · ${result.guests} guests${planTag}`, perPerson: null }
  }
  if (room.pricing.type === 'perPerson' && guests == null) {
    const pp = room.pricing.rate + (plan === 'MAP' ? MAP_ADD : 0)
    return { label, main: formatNpr(pp), note: `per person · from ${room.minGuests} guests${planTag}`, perPerson: null }
  }
  return {
    label,
    main: formatNpr(result.total),
    note: `per night · ${result.guests} guests${planTag}`,
    perPerson: guests == null ? null : `${formatNpr(result.perPerson)} per person`,
  }
}

export const rateTable = (room, plan) => {
  const rows = []
  for (let g = room.minGuests; g <= room.maxGuests && rows.length < 12; g += 1) rows.push({ guests: g, bb: priceFor(room, g, 'BB'), map: priceFor(room, g, 'MAP') })
  return rows
}

const niceDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const stayMessage = (room, { guests, plan, checkIn, checkOut } = {}) => {
  const parts = [`Hello G'Host Villa! I would like to book the ${room.name}`]
  if (guests) parts.push(`for ${guests} guests`)
  if (plan) parts.push(`on the ${plan} plan`)
  if (checkIn) {
    const nights = checkOut ? Math.round((new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / 86400000) : 0
    parts.push(checkOut ? `from ${niceDate(checkIn)} to ${niceDate(checkOut)} (${nights} ${nights === 1 ? 'night' : 'nights'})` : `from ${niceDate(checkIn)}`)
  }
  return `${parts.join(' ')}. Is it available?`
}

// Short note under the guest filter, taken from the owner's group-size notes
export function groupHint(guests) {
  if (guests == null) return 'Choose how many are coming and we show only the stays that fit, best match first.'
  if (guests <= 2) return 'A couple: choose the Mountain View, City View or the Suite.'
  if (guests === 3) return 'Group of 3: Mountain View, City View or the Suite, with one extra guest at NPR 1,500.'
  if (guests === 4) return 'Two couples or a group of 4: the whole dome house, any single room, the group section or the villa top.'
  if (guests <= 7) return `Group of ${guests}: the dome house, the group section, the villa top${guests >= 6 ? ' or villa top + suite' : ''}.`
  return `Groups of ${WHATSAPP_FROM}+ are booked directly on WhatsApp, and the team confirms the price.`
}

/** Lowest and highest nightly cost for a stay, or null when the price is only given on WhatsApp. */
export function costSpan(room, guests, plan) {
  const result = priceFor(room, guests, plan)
  if (result.kind === 'exact') return { min: result.total, max: result.total }
  if (result.kind === 'range') return { min: result.min, max: result.max }
  return null
}

// Bedroom count per stay, shown on cards so guests can see at a glance if it fits.
const BEDROOMS = {
  'mountain-view-room': 1, 'city-view-room': 1, 'pyramid-dome-house': 2, suite: 1, 'group-section': 3,
  'villa-top-floor': 2, 'ground-floor': 4, 'villa-top-plus-suite': 3, 'villa-top-plus-group-section': 5,
  'whole-villa': 7, 'whole-villa-plus-pyramid': 9,
}
export const bedroomsOf = (room) => BEDROOMS[room.id] ?? null

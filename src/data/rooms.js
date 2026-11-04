// ─────────────────────────────────────────────────────────────
//  ROOMS: add, remove or rename rooms here.
//  price = NPR per night. The numbers below are SAMPLE placeholders (a "Sample rate" badge
//  is shown while `placeholderPrice: true`). Enter your real rate and delete that line.
//  amenity keys: breakfast, wifi, bathroom, hotwater, ac, coffee, balcony, toiletries, slippers
// ─────────────────────────────────────────────────────────────
export const rooms = [
  {
    id: 'couple-deluxe',
    name: 'Couple Deluxe Room',
    image: '/images/room-couple.webp',
    alt: 'Couple Deluxe Room with a double bed, red throw, wooden floor and a large window',
    price: 4500,
    placeholderPrice: true,
    blurb: 'Bright, quiet and warm, with a big window, wooden floors and a comfortable double bed.',
    amenities: ['breakfast', 'wifi', 'bathroom', 'hotwater', 'ac', 'coffee', 'balcony', 'toiletries', 'slippers'],
  },
  {
    id: 'hilltop-double',
    name: 'Hilltop Double Room',
    image: '/images/room-deluxe.webp',
    alt: 'Double room with red bed runner, wooden floor, round carved mirror and fresh flowers',
    price: 3800,
    placeholderPrice: true,
    blurb: 'A cosy double with handcrafted touches, fresh flowers and a restful hillside hush.',
    amenities: ['breakfast', 'wifi', 'bathroom', 'hotwater', 'ac', 'coffee', 'balcony', 'toiletries', 'slippers'],
  },
]

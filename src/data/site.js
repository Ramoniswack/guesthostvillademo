// ─────────────────────────────────────────────────────────────
//  SITE SETTINGS: edit contact details and links here only.
//  Anything in [SQUARE BRACKETS] is a placeholder for you to replace.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "G'Host Villa",
  fullName: "G'Host Villa Hotel & Restaurant",

  phoneDisplay: '[PHONE]',            // what visitors read, e.g. "+977 98XXXXXXXX"
  phoneTel: '+977XXXXXXXXXX',         // digits for the call link, e.g. "+9779812345678"
  whatsappDisplay: '[WHATSAPP]',
  whatsappNumber: '977XXXXXXXXXX',    // country code + number, digits only, no "+"
  email: '[EMAIL]',
  address: 'Sarangkot, Pokhara, Nepal',
  hours: '[OPENING HOURS]',

  // Used for the Directions buttons and embedded map. Swap for exact
  // coordinates ("28.2437,83.9486") or the Google Maps place name once you have them.
  mapsQuery: "G'Host Villa Hotel & Restaurant, Sarangkot, Pokhara",

  // Menu PDF in /public (regenerate or replace the file, see README)
  menuPdf: '/ghost-villa-menu.pdf',

  social: {
    instagram: '#',   // [INSTAGRAM URL]
    facebook: '#',    // [FACEBOOK URL]
    tripadvisor: '#', // [TRIPADVISOR URL]
    booking: '#',     // [BOOKING.COM URL]
  },
}

export const telLink = `tel:${site.phoneTel}`
export const waLink = (text = "Hello G'Host Villa! I'd like to ask about a stay / table.") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`
export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`

// Main navigation: each item is its own page (the logo returns to Home).
export const navLinks = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/menu', label: 'Menu' },
  { to: '/faq', label: 'FAQ' },
  { to: '/jobs', label: 'Jobs' },
]

// Stats row. Use a NUMBER to get the kinetic odometer animation (e.g. value: 12, suffix: '+').
// Use a string (e.g. '[X]+') to show a placeholder as-is.
// MENU_COUNT / ROOM_COUNT are computed from menu.js / rooms.js, so they update themselves.
export const stats = [
  { value: 3, suffix: '+', label: 'years welcoming guests' },
  { value: 10000, suffix: '+', label: 'happy guests hosted' },
  { value: 'MENU_COUNT', suffix: '+', label: 'dishes & drinks on the menu' },
  { value: 'ROOM_COUNT', label: 'room types, breakfast included' },
]

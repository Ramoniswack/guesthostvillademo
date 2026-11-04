// ─────────────────────────────────────────────────────────────
//  SITE SETTINGS: Official contact details & social channels
//  The G'Host Villa Restro and Bar Pokhara (Ghost Villa Pokhara)
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "G'Host Villa",
  fullName: "The G'Host Villa Restro and Bar Pokhara",

  phoneDisplay: '+977 984-0023756',
  phoneTel: '+9779840023756',
  altPhoneDisplay: '+977 986-0106709',
  altPhoneTel: '+9779860106709',
  whatsappDisplay: '+977 984-0023756',
  whatsappNumber: '9779840023756',
  email: 'theghostvilla@gmail.com',
  address: 'Sarangkot Road, Ranipauwa (Fulbari), Pokhara 33700, Nepal',
  locationNote: '20 minutes from Lakeside & central Pokhara',
  hours: 'Open daily · 7:00 AM – 10:00 PM',

  // Google Maps location query
  mapsQuery: "The G'Host villa restro and bar pokhara",

  // Menu PDF in /public
  menuPdf: '/ghost-villa-menu.pdf',

  social: {
    instagram: 'https://www.instagram.com/the_g_host_villa_pokhara/',
    facebook: 'https://www.facebook.com/p/The-GHost-villa-restro-and-bar-pokhara-100064191330768/',
    esewa: 'https://esewahotels.com/hotel/the-ghost-villa-restro-and-bar-pokhara',
    makemytrip: 'https://www.makemytrip.global/hotels-international/en-om/nepal/pokhara-hotels/ghost_villa_pokhara_with_mountain_view_20mins_from_main_area-details.html',
    tripadvisor: 'https://www.google.com/search?q=the+g_host+villa+pokhara',
    booking: 'https://esewahotels.com/hotel/the-ghost-villa-restro-and-bar-pokhara',
  },
}

export const telLink = `tel:${site.phoneTel}`
export const altTelLink = `tel:${site.altPhoneTel}`
export const waLink = (text = "Hello G'Host Villa! I'd like to ask about a stay / table.") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`
export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`

// Main navigation: each item is its own page
export const navLinks = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/menu', label: 'Menu' },
  { to: '/faq', label: 'FAQ' },
  { to: '/jobs', label: 'Jobs' },
]

// Stats row.
export const stats = [
  { value: 4.5, suffix: '★', label: 'Google rating (379+ reviews)' },
  { value: 24, suffix: ' guests', label: 'max capacity for group stays' },
  { value: 1550, suffix: '/-', label: 'NPR package rate starting pp' },
  { value: 20, suffix: ' mins', label: 'scenic drive from main area' },
]

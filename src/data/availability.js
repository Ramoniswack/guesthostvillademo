// ─────────────────────────────────────────────────────────────
//  AVAILABILITY: dates that are already taken
//
//  The site has no booking database, so the calendar shows every future date as
//  open unless you list it here. Keep this in sync with your WhatsApp bookings.
//
//  Add one entry per stay, using the stay's id from rooms.js and each NIGHT that is
//  taken as 'YYYY-MM-DD' (the night you sleep there; the check-out morning is not a night).
//
//  Example:
//    'mountain-view-room': ['2026-12-24', '2026-12-25', '2026-12-26'],
//
//  Taken dates show crossed out in the calendar and cannot be selected.
//  Stays that share rooms (e.g. the whole dome house and its two rooms) are linked
//  below, so blocking a room also blocks the bigger stays that contain it.
// ─────────────────────────────────────────────────────────────
export const blockedNights = {
  // 'mountain-view-room': ['2026-12-24', '2026-12-25'],
}

export const MIN_NIGHTS = 1
export const MAX_NIGHTS = 30

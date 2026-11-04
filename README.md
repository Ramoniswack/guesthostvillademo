# G'Host Villa Hotel & Restaurant: website

Next.js 15 (App Router) + Tailwind CSS + Framer Motion. Builds to a static site (`output: 'export'`), ready for Cloudflare Pages.

```bash
npm install
npm run dev       # local preview at http://localhost:3000
npm run build     # production build → out/
```

## Pages
`/` Home · `/rooms` · `/menu` · `/faq` · `/jobs`. Each lives in `src/app/<route>/page.jsx` and renders a view from `src/_views/`.
The navbar links are set in `src/data/site.js` (`navLinks`).

## Where to edit things

| I want to…                         | Edit this file                         |
|------------------------------------|----------------------------------------|
| Set phone / WhatsApp / email / hours / map / social links | `src/data/site.js` |
| Change menu items or **prices**    | `src/data/menu.js` (one line per item)  |
| Change rooms, names, amenities     | `src/data/rooms.js`                     |
| Edit FAQ answers                   | `src/data/faq.js` (answers marked `[CONFIRM]`) |
| Replace sample reviews             | `src/data/reviews.js` (delete `placeholder: true`) |
| Change the photo strip             | `src/data/gallery.js`                   |
| Room **prices** (NPR / night)      | `src/data/rooms.js` (`price`, then delete `placeholderPrice`) |
| Job openings                       | `src/data/jobs.js`                      |
| Years / guests counters            | `src/data/site.js` (`stats`)            |

Everything in `[SQUARE BRACKETS]` on the live page is a placeholder for you to replace.

### Menu prices
Open `src/data/menu.js`. Each item looks like `{ name: 'Veg burger', price: 250, veg: true }`.
- Change `price`, save, done. No component changes needed.
- Items with variants use `options: [{ label: 'Steamed', price: 260 }, …]`.
- `veg: true` = veg marker, `veg: false` = non-veg marker, leave out = no marker (unknown/mixed).
  **Please review these flags**: egg dishes, ramen, "Villa Special" etc. are left unmarked.
- `pick: true` shows the "Chef's pick" tag. I tagged a few as examples; choose your own.
- `price: null` shows "Ask staff" (used for spirits & coolers, whose prices were unreadable in the source menu).
- Short descriptions are added only where the dish is self-explanatory. Add `desc: '…'` to any item.

### Phone & WhatsApp
In `src/data/site.js` set `phoneTel` (e.g. `+9779812345678`), `whatsappNumber` (digits only, e.g. `9779812345678`), and the `…Display` texts. All Call / WhatsApp buttons update automatically.

### Swap photos
Put new files in `public/images/` (WebP, ~1200px wide is plenty) and update the paths in `rooms.js`, `gallery.js`, or the components (`Hero.jsx` uses `hero.webp`; `Story.jsx` uses `pyramid.webp`; `Visit.jsx` and `CtaBanner.jsx` use `night-aerial.webp`). Keep the descriptive `alt` text. If a building gets cropped, adjust the `object-[x%_y%]` class next to the image.
For social sharing, `public/images/og.jpg` is the Open Graph image.

### Menu PDF
`public/ghost-villa-menu.pdf` was generated from `menu.js`. After changing prices, regenerate it:
```bash
node scripts/menu-to-html.mjs   # writes scripts/menu-print.html
```
Open that file in a browser → Print → Save as PDF → save as `public/ghost-villa-menu.pdf`.

### SEO
- `src/app/layout.jsx`: replace `YOUR-DOMAIN.com` (metadataBase + JSON-LD) and the `[EMAIL]` / `+977XXXXXXXXXX` placeholders. Per-page titles are set in each `page.jsx`.
- Add real coordinates or the Google Maps place name to `mapsQuery` in `site.js`.

## Deploy to Cloudflare Pages
Build command: `npm run build`   Build output directory: `out`   (Node 18.18+).

import 'lenis/dist/lenis.css'
import './globals.css'
import Providers from '../components/Providers.jsx'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '')
const BACKEND_OG_IMAGE = `${BACKEND_URL}/images/og.jpg`

export const metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: "G'Host Villa Hotel & Restaurant | Stay, Dine & Breathe in Sarangkot, Pokhara",
    template: "%s | G'Host Villa",
  },
  description:
    'Hilltop villa stay, restaurant and bar in Sarangkot, Pokhara, Nepal. Rooms with breakfast, fresh food, and valley and Himalayan views. Call or WhatsApp to book.',
  icons: { icon: `${BACKEND_URL}/images/logo-icon.png` },
  openGraph: {
    type: 'website',
    siteName: "G'Host Villa Hotel & Restaurant",
    title: "G'Host Villa: Stay, Dine & Breathe Above Pokhara",
    description: 'A hilltop villa, restaurant and bar in Sarangkot with valley and Himalayan views.',
    images: [BACKEND_OG_IMAGE],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport = { themeColor: '#FFFFFF' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Hotel', 'Restaurant'],
  name: "G'Host Villa Hotel & Restaurant",
  description: 'Hilltop villa stay, restaurant and bar in Sarangkot, Pokhara, Nepal with valley and Himalayan views.',
  telephone: '+9779840023756',
  email: 'theghostvilla@gmail.com',
  servesCuisine: ['Nepali', 'Newari', 'Momo', 'Pizza & Pasta', 'Barbecue', 'Bar & Cocktails'],
  image: BACKEND_OG_IMAGE,
  ...(SITE_URL ? { url: `${SITE_URL}/`, hasMenu: `${SITE_URL}/menu` } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sarangkot Road, Ranipauwa (Fulbari)',
    addressLocality: 'Pokhara',
    addressRegion: 'Gandaki Province',
    postalCode: '33700',
    addressCountry: 'NP',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href={`${BACKEND_URL}/images/hero.webp`} fetchPriority="high" />
        <link rel="preconnect" href={BACKEND_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Apple system fonts on Apple devices; Inter is the matching fallback elsewhere */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={{ '--contour-image': `url("${BACKEND_URL}/images/contour.svg")` }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

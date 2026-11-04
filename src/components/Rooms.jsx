'use client'

import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { rooms } from '../data/rooms.js'
import { telLink, waLink } from '../data/site.js'

const AMENITY = {
  breakfast: ['utensils', 'Breakfast included'],
  wifi: ['wifi', 'Wi-Fi'],
  bathroom: ['bath', 'Attached bathroom'],
  hotwater: ['flame', 'Hot water'],
  ac: ['snow', 'AC'],
  coffee: ['coffee', 'Tea / coffee maker'],
  balcony: ['door', 'Balcony'],
  toiletries: ['drop', 'Toiletries'],
  slippers: ['feet', 'Slippers'],
}

const npr = (n) => `NPR ${n.toLocaleString('en-US')}`

function RoomCard({ r }) {
  return (
    <article className="grid overflow-hidden rounded-[32px] bg-sand lg:grid-cols-[1.05fr_1fr]">
      <img
        src={r.image}
        alt={r.alt}
        width="1200"
        height="799"
        loading="lazy"
        className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto"
      />
      <div className="flex flex-col p-8 md:p-12">
        <h3 className="font-display text-3xl font-semibold text-forest md:text-[2.5rem] md:leading-[1.1]">{r.name}</h3>
        <p className="mt-4 text-lg text-ink/80">{r.blurb}</p>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3.5">
          {r.amenities.map((k) => (
            <li key={k} className="flex items-center gap-2.5 text-base text-forest">
              <Icon name={AMENITY[k][0]} className="h-5 w-5 shrink-0 text-sage-dark" />
              {AMENITY[k][1]}
            </li>
          ))}
        </ul>

        <div className="mt-9 border-t border-sage/30 pt-7">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-display text-4xl font-semibold text-forest" style={{ letterSpacing: '-0.03em' }}>{npr(r.price)}</span>
            <span className="text-base text-muted">per night · breakfast included</span>
            {r.placeholderPrice && (
              <span className="ml-1 self-center rounded-full bg-sun/25 px-2.5 py-1 text-xs font-semibold text-forest-dark">Sample rate</span>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={waLink(`Hello! I'd like to book the ${r.name} (${npr(r.price)} per night).`)} icon="chat" arrow={false}>
              Book on WhatsApp
            </Button>
            <Button href={telLink} variant="outline" icon="phone" arrow={false}>
              Call
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** All rooms. On the home page `preview` adds a heading and a link to the full Rooms page. */
export default function Rooms({ preview = false }) {
  return (
    <section id="rooms" className={preview ? 'section' : 'pb-24 pt-20 md:pb-40 md:pt-28'}>
      <div className="wrap">
        {preview && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="label">Rooms</p>
            <h2 className="h2">Rest well in the hills</h2>
            <p className="lead mt-5">Two calm rooms with breakfast every morning. Rates shown per night.</p>
          </Reveal>
        )}

        <div className={`${preview ? 'mt-16 md:mt-20' : ''} space-y-8 md:space-y-10`}>
          {rooms.map((r) => (
            <Reveal key={r.id}>
              <RoomCard r={r} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-base text-muted">
          Rates may change by season. Message us for a written quote with meals, room allocation and cancellation terms.
        </p>
        {preview && <Button href="/rooms" variant="outline" className="mt-8">View all rooms</Button>}
      </div>
    </section>
  )
}

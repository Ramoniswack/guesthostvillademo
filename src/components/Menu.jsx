'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { categories, menuNote } from '../data/menu.js'
import { site, waLink } from '../data/site.js'

const npr = (n) => `NPR ${n.toLocaleString('en-US')}`

/** Little veg / non-veg marker: leaf-green dot in a rounded square, terracotta dot for non-veg. */
function Mark({ veg }) {
  if (veg === undefined || veg === null) return <span className="inline-block h-4 w-4 shrink-0" aria-hidden="true" />
  const c = veg ? 'border-leaf text-leaf' : 'border-meat text-meat'
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 translate-y-[3px] items-center justify-center rounded-[5px] border-2 ${c}`}
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  )
}

function Item({ item }) {
  const hasOptions = !!item.options
  return (
    <li className="py-3">
      <div className="flex items-baseline gap-2">
        <Mark veg={item.veg} />
        <span className="font-bold text-forest">{item.name}</span>
        {item.pick && (
          <span className="inline-flex items-center gap-1 self-center rounded-full bg-sun/25 px-2.5 py-0.5 text-[0.72rem] font-bold uppercase leading-tight text-forest-dark" style={{ letterSpacing: '0.04em' }}>
            <Icon name="leaf" className="h-3 w-3" strokeWidth={2.2} /> Chef's pick
          </span>
        )}
        {!hasOptions && (
          <>
            <span className="mb-1 min-w-[1.5rem] flex-1 border-b-2 border-dotted border-sage" aria-hidden="true" />
            <span className="whitespace-nowrap font-bold tabular-nums text-ink">
              {item.price == null ? 'Ask staff' : npr(item.price)}
            </span>
          </>
        )}
      </div>
      {item.desc && <p className="pl-6 text-[0.95rem] leading-snug text-muted">{item.desc}</p>}
      {item.note && <p className="pl-6 text-[0.95rem] italic leading-snug text-muted">{item.note}</p>}
      {hasOptions && (
        <ul className="mt-2 flex flex-wrap gap-2 pl-6">
          {item.options.map((o) => (
            <li key={o.label} className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-[0.9rem] text-ink">
              {o.label}
              <span className="font-bold tabular-nums text-forest">{npr(o.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function Group({ group, tag }) {
  return (
    <section className="min-w-0 rounded-3xl bg-cream p-6 shadow-soft md:p-8">
      {tag && <p className="label !mb-1">{tag}</p>}
      <h3 className="font-display text-2xl font-semibold text-forest">{group.title}</h3>
      {group.note && <p className="mt-1 text-base text-muted">{group.note}</p>}
      <ul className="mt-3 divide-y divide-sage/20">
        {group.items.map((it) => (
          <Item key={it.name} item={it} />
        ))}
      </ul>
    </section>
  )
}

/** Veg-only filter: keep clearly veg items, and for option items keep only their veg options. */
function onlyVeg(item) {
  if (item.veg === true) return item
  if (item.options) {
    const o = item.options.filter((x) => x.veg === true)
    if (o.length) return { ...item, options: o }
  }
  return null
}

export default function Menu() {
  const [tab, setTab] = useState(categories[0].id)
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const tabRefs = useRef({})

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  // keep the active tab centred inside the tab strip. Scrolls only the strip, never the page.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const btn = tabRefs.current[tab]
    const strip = btn?.parentElement
    if (strip) strip.scrollTo({ left: btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' })
  }, [tab])

  const filterItems = (items) =>
    items.map((it) => (vegOnly ? onlyVeg(it) : it)).filter(Boolean)

  // normal view: groups of the active tab
  const tabGroups = useMemo(() => {
    const cat = categories.find((c) => c.id === tab)
    return cat.groups.map((g) => ({ ...g, items: filterItems(g.items) })).filter((g) => g.items.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, vegOnly])

  // search view: matches across the whole menu
  const results = useMemo(() => {
    if (!searching) return []
    const out = []
    categories.forEach((c) =>
      c.groups.forEach((g) => {
        const items = filterItems(g.items).filter((it) =>
          [it.name, it.desc, g.title, c.label, ...(it.options || []).map((o) => o.label)]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q)
        )
        if (items.length) out.push({ ...g, items, tag: c.label })
      })
    )
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, vegOnly])

  const groups = searching ? results : tabGroups

  return (
    <section id="menu" className="contour bg-sand pb-24 pt-28 md:pb-40 md:pt-36">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="label">Restro &amp; Bar</p>
          <h2 className="h2">Fresh food, mountain air</h2>
        </Reveal>

        <p className="mt-8 inline-flex items-start gap-3 rounded-2xl bg-cream px-5 py-3 text-base font-semibold text-forest shadow-soft">
          <Icon name="leaf" className="mt-0.5 h-5 w-5 shrink-0 text-sage-dark" />
          {menuNote}
        </p>

        {/* search + veg toggle */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1 sm:max-w-md">
            <span className="sr-only">Search the menu</span>
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-dark" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu: momo, pizza, tea…"
              className="min-h-[52px] w-full rounded-full border-2 border-sage/50 bg-cream pl-12 pr-4 text-base text-ink placeholder:text-muted focus:border-forest focus:outline-none"
            />
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={vegOnly}
            onClick={() => setVegOnly((v) => !v)}
            className="inline-flex min-h-[52px] items-center gap-3 self-start rounded-full bg-cream px-5 text-base font-bold text-forest shadow-soft"
          >
            <span className={`relative h-7 w-12 rounded-full transition-colors ${vegOnly ? 'bg-leaf' : 'bg-sage/60'}`}>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-cream shadow transition-all ${vegOnly ? 'left-[22px]' : 'left-0.5'}`} />
            </span>
            Veg only
          </button>
          <p className="flex items-center gap-4 text-sm text-muted sm:ml-auto">
            <span className="inline-flex items-center gap-1.5"><Mark veg={true} /> Veg</span>
            <span className="inline-flex items-center gap-1.5"><Mark veg={false} /> Non-veg</span>
          </p>
        </div>
      </div>

      {/* sticky category tabs */}
      <div className="sticky top-[5.25rem] z-30 mt-10 border-y border-sage/30 bg-sand">
        <div className="wrap">
          <div role="tablist" aria-label="Menu categories" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-3">
            {categories.map((c) => {
              const on = !searching && tab === c.id
              return (
                <button
                  key={c.id}
                  ref={(el) => (tabRefs.current[c.id] = el)}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => { setQuery(''); setTab(c.id) }}
                  className={`min-h-[48px] shrink-0 rounded-full px-5 text-base font-bold transition-colors ${
                    on ? 'bg-forest text-cream' : 'border-2 border-forest/25 bg-cream text-forest hover:border-forest'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="wrap mt-8">
        {searching && (
          <p className="mb-4 text-base text-muted" aria-live="polite">
            {results.reduce((n, g) => n + g.items.length, 0)} result(s) for “{query}”
          </p>
        )}
        {groups.length === 0 ? (
          <p className="rounded-3xl bg-cream p-8 text-center text-lg text-forest shadow-soft">
            Nothing found{vegOnly ? ' in the veg menu' : ''}. Try another word, or ask our staff, since we can often cook
            more than what's listed.
          </p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {groups.map((g) => (
              <Group key={`${g.tag || ''}${g.title}`} group={g} tag={g.tag} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href={waLink("Hello! I'd like to order / reserve a table at G'Host Villa.")} icon="chat" arrow={false}>
            Order / Reserve a table on WhatsApp
          </Button>
          <Button href={site.menuPdf} variant="outline" icon="download" arrow={false} download>
            Download menu (PDF)
          </Button>
        </div>
      </div>
    </section>
  )
}

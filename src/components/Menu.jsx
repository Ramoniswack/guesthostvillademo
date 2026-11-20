'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Leaf, MessageCircle, Search, Utensils } from 'lucide-react'
import { Button, Reveal } from './ui.jsx'
import { categories, menuNote } from '../data/menu.js'
import { site, waLink } from '../data/site.js'

const npr = (n) => `NPR ${n.toLocaleString('en-US')}`

/** Veg / non-veg indicator dot. */
function Mark({ veg }) {
  if (veg === undefined || veg === null) return <span className="inline-block h-4 w-4 shrink-0" aria-hidden="true" />
  const c = veg ? 'border-leaf text-leaf' : 'border-sun-text text-sun-text'
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 translate-y-[2px] items-center justify-center rounded-[5px] border-2 ${c}`}
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
    <li className="py-3.5">
      <div className="flex items-baseline gap-2.5">
        <Mark veg={item.veg} />
        <span className="font-semibold text-forest">{item.name}</span>
        {item.pick && (
          <span className="inline-flex items-center gap-1 self-center rounded-full bg-sun px-2.5 py-0.5 text-[0.65rem] font-bold uppercase leading-tight tracking-[0.06em] text-forest-dark">
            Chef&apos;s pick
          </span>
        )}
        {!hasOptions && (
          <>
            <span className="mb-1 min-w-[1.5rem] flex-1 border-b border-dotted border-forest/25" aria-hidden="true" />
            <span className="whitespace-nowrap font-bold tabular-nums text-forest">
              {item.price == null ? 'Ask staff' : npr(item.price)}
            </span>
          </>
        )}
      </div>
      {item.desc && <p className="mt-0.5 pl-6 text-xs leading-relaxed text-forest/70">{item.desc}</p>}
      {item.note && <p className="mt-0.5 pl-6 text-xs italic leading-relaxed text-forest/65">{item.note}</p>}
      {hasOptions && (
        <ul className="mt-2 flex flex-wrap gap-2 pl-6">
          {item.options.map((o) => (
            <li
              key={o.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-white px-3 py-1 text-xs text-forest/85"
            >
              <span>{o.label}</span>
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
    <section className="min-w-0 rounded-2xl border border-forest/15 bg-white p-6 shadow-soft md:p-7">
      <div className="flex items-start justify-between gap-3 border-b border-forest/10 pb-3.5">
        <div>
          {tag && <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">{tag}</p>}
          <h3 className="mt-0.5 font-display text-2xl font-semibold leading-tight text-forest">{group.title}</h3>
          {group.note && <p className="mt-1 text-xs text-forest/65">{group.note}</p>}
        </div>
        <span className="shrink-0 rounded-full border border-forest/15 bg-white px-2.5 py-1 text-[0.68rem] font-bold text-forest/70">
          {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <ul className="mt-1 divide-y divide-forest/10">
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

const categoryCount = (cat, vegOnly) =>
  cat.groups.reduce(
    (sum, g) => sum + g.items.map((it) => (vegOnly ? onlyVeg(it) : it)).filter(Boolean).length,
    0,
  )

export default function Menu() {
  const [tab, setTab] = useState(categories[0].id)
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const tabRefs = useRef({})

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const btn = tabRefs.current[tab]
    const strip = btn?.parentElement
    if (strip) strip.scrollTo({ left: btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' })
  }, [tab])

  const filterItems = (items) => items.map((it) => (vegOnly ? onlyVeg(it) : it)).filter(Boolean)

  const tabGroups = useMemo(() => {
    const cat = categories.find((c) => c.id === tab)
    return cat.groups.map((g) => ({ ...g, items: filterItems(g.items) })).filter((g) => g.items.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, vegOnly])

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
            .includes(q),
        )
        if (items.length) out.push({ ...g, items, tag: c.label })
      }),
    )
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, vegOnly])

  const groups = searching ? results : tabGroups

  return (
    <section id="menu" className="bg-white pb-20 pt-28 md:pb-28 md:pt-36">
      {/* 1 · Editorial Restro Header & Quick Info */}
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="label">Pyramid Restro &amp; Bottle Bar · {site.hours}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">
              Fresh food, mountain air.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-forest/75">
              Nepali classics, Newari platters, handmade momo, wood-fired plates, BBQ and drinks served overlooking the valley.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold text-forest">
              <Leaf className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
              <span>{menuNote}</span>
            </p>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col items-start gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2.5">
              <Button href={waLink("Hello G'Host Villa! I'd like to reserve a table or order food.")} arrow={false}>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Reserve a table</span>
                </span>
              </Button>
              <Button href={site.menuPdf} variant="outline" arrow={false} download>
                <span className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>PDF Menu</span>
                </span>
              </Button>
            </div>
            <p className="flex items-center gap-4 text-xs font-medium text-forest/70">
              <span className="inline-flex items-center gap-1.5"><Mark veg={true} /> Vegetarian</span>
              <span className="inline-flex items-center gap-1.5"><Mark veg={false} /> Non-veg</span>
            </p>
          </Reveal>
        </div>
      </div>

      {/* 2 · Unified Sticky Search, Veg Filter & Category Tabs */}
      <div className="sticky top-[4.5rem] z-30 mt-8 border-y border-forest/15 bg-white/95 py-3 backdrop-blur-md">
        <div className="wrap space-y-3">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label className="relative block flex-1 sm:max-w-md">
              <span className="sr-only">Search the menu</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search momo, pizza, coffee, drinks…"
                className="min-h-[44px] w-full rounded-full border border-forest/20 bg-white pl-10 pr-4 text-sm text-forest placeholder:text-forest/45 focus:border-forest focus:outline-none"
              />
            </label>

            <button
              type="button"
              role="switch"
              aria-checked={vegOnly}
              onClick={() => setVegOnly((v) => !v)}
              className={`inline-flex min-h-[44px] items-center gap-2.5 self-start rounded-full border px-4 text-xs font-bold uppercase tracking-[0.1em] transition ${
                vegOnly ? 'border-leaf bg-leaf text-white' : 'border-forest/20 bg-white text-forest hover:border-forest'
              }`}
            >
              <span className={`relative h-5 w-9 rounded-full transition-colors ${vegOnly ? 'bg-white/30' : 'bg-forest/15'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${vegOnly ? 'left-[18px]' : 'left-0.5'}`} />
              </span>
              <span>Veg only</span>
            </button>
          </div>

          <div role="tablist" aria-label="Menu categories" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            {categories.map((c) => {
              const on = !searching && tab === c.id
              const count = categoryCount(c, vegOnly)
              return (
                <button
                  key={c.id}
                  ref={(el) => (tabRefs.current[c.id] = el)}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => { setQuery(''); setTab(c.id) }}
                  className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    on
                      ? 'bg-forest text-white shadow-sm'
                      : 'border border-forest/20 bg-white text-forest hover:border-forest'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[0.65rem] ${on ? 'bg-white/20 text-white' : 'bg-sun/25 text-forest-dark'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3 · Menu Group Cards */}
      <div className="wrap mt-8">
        {searching && (
          <p className="mb-4 text-sm font-semibold text-forest/70" aria-live="polite">
            {results.reduce((n, g) => n + g.items.length, 0)} result(s) for “{query}”
          </p>
        )}

        <AnimatePresence mode="wait">
          {groups.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-forest/15 bg-white p-10 text-center text-forest shadow-soft"
            >
              <p className="font-medium">
                Nothing found{vegOnly ? ' in the veg menu' : ''}. Try another dish name or ask our kitchen team directly.
              </p>
              <button
                type="button"
                onClick={() => { setQuery(''); setVegOnly(false) }}
                className="mt-4 inline-flex items-center rounded-full bg-sun px-5 py-2 text-xs font-semibold text-forest-dark transition hover:bg-sun-dark"
              >
                Reset search
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={searching ? `search-${q}-${vegOnly}` : `${tab}-${vegOnly}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
              className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
            >
              {groups.map((g) => (
                <Group key={`${g.tag || ''}${g.title}`} group={g} tag={g.tag} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 · Group Dining & BBQ Banner */}
        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-forest-dark p-7 text-white shadow-warm md:flex-row md:items-center md:p-9">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-sun">
              <Utensils className="h-3.5 w-3.5" aria-hidden="true" />
              Group dining &amp; MAP meal plans
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Planning a group BBQ, celebration dinner or stay meal plan?
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Pre-order custom platters, birthday cakes or add the MAP meal plan (+NPR 550 per person) directly with our kitchen team.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={waLink("Hello G'Host Villa! I'd like to pre-order group dining or reserve a table.")} arrow={false}>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </span>
            </Button>
            <Button href={site.menuPdf} variant="light" arrow={false} download>
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>PDF Menu</span>
              </span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

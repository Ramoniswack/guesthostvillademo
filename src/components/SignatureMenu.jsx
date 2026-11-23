'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Reveal } from './ui.jsx'
import { featuredBlocks, listBlocks, menuTabs } from '../data/signature.js'
import { site, telLink } from '../data/site.js'
import { useBackendData } from '../lib/backend.jsx'

/** Veg / non-veg indicator dot matching Menu.jsx. */
function Mark({ veg }) {
  if (veg === undefined || veg === null) {
    return <span className="inline-block h-3.5 w-3.5 shrink-0" aria-hidden="true" />
  }
  const color = veg ? 'border-leaf text-leaf' : 'border-sun-text text-sun-text'
  return (
    <span
      className={`inline-flex h-3.5 w-3.5 shrink-0 translate-y-[2px] items-center justify-center rounded-[4px] border-[1.5px] ${color}`}
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  )
}

function ItemRow({ item }) {
  return (
    <li className="py-1">
      <div className="flex items-baseline gap-2">
        <Mark veg={item.veg} />
        <span className="text-[0.88rem] font-semibold leading-snug text-ink">
          {item.name}
        </span>
        {item.pick && (
          <span className="shrink-0 rounded-full bg-sun px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.06em] text-forest-dark">
            Chef&apos;s pick
          </span>
        )}
        <span
          className="mb-1 min-w-[0.75rem] flex-1 border-b border-dotted border-ink/20"
          aria-hidden="true"
        />
        <span className="shrink-0 text-xs font-bold tabular-nums text-ink/70 sm:text-[0.82rem]">
          NPR {item.price}
        </span>
      </div>
      {item.desc && (
        <p className="mt-0.5 pl-5 text-[0.74rem] leading-relaxed text-ink/55">
          {item.desc}
        </p>
      )}
    </li>
  )
}

/** 2-column printed menu block: items on the left + 1 large round plate photo on the right. */
function FeaturedCategoryTile({ block, index }) {
  return (
    <Reveal
      delay={Math.min(index * 0.03, 0.18)}
      className="group flex flex-row items-start justify-between gap-5 max-[420px]:flex-col-reverse"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-[1.75rem]">
            {block.title}
          </h2>
          {block.note && (
            <span className="text-[0.72rem] font-medium text-ink/50">
              {block.note}
            </span>
          )}
        </div>
        <div className="mt-2 h-[1.5px] w-10 bg-sun" aria-hidden="true" />

        <ul className="mt-3.5 space-y-1.5">
          {block.items.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </ul>
      </div>

      {block.image && (
        <div className="w-[34%] max-w-[190px] shrink-0 max-[420px]:w-36 sm:w-[165px] xl:w-[190px]">
          <img
            src={block.image}
            alt={`${block.title} plated dish`}
            width={900}
            height={900}
            loading="lazy"
            className="aspect-square w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:rotate-[3deg] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        </div>
      )}
    </Reveal>
  )
}

/** Bottom 2-column printed list block (Dessert / Beverage / Bar style from the reference poster). */
function PrintedListTile({ block }) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-[1.75rem]">
          {block.title}
        </h2>
        {block.note && (
          <span className="text-[0.72rem] font-medium text-ink/50">
            {block.note}
          </span>
        )}
      </div>
      <div className="mt-2 h-[1.5px] w-10 bg-sun" aria-hidden="true" />

      <ul className="mt-4 space-y-1.5">
        {block.items.map((item) => (
          <ItemRow key={item.name} item={item} />
        ))}
      </ul>
    </Reveal>
  )
}

export default function SignatureMenu() {
  const backend = useBackendData()
  const currentSite = backend?.site || site
  const currentTel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const instagramUrl = currentSite.social?.instagram || site.social.instagram
  const facebookUrl = currentSite.social?.facebook || site.social.facebook

  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const [dietFilter, setDietFilter] = useState('all') // 'all' | 'veg' | 'nonveg'

  const q = query.trim().toLowerCase()

  const matchesItem = (item) => {
    if (dietFilter === 'veg' && item.veg !== true) return false
    if (dietFilter === 'nonveg' && item.veg !== false) return false
    if (!q) return true
    return `${item.name} ${item.desc || ''}`.toLowerCase().includes(q)
  }

  const tabCounts = useMemo(() => {
    const counts = { all: 0 }
    for (const t of menuTabs) {
      if (t.id !== 'all') counts[t.id] = 0
    }
    for (const block of [...featuredBlocks, ...listBlocks]) {
      const c = block.items.filter(matchesItem).length
      counts[block.tab] = (counts[block.tab] || 0) + c
      counts.all += c
    }
    return counts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, dietFilter])

  const visibleFeatured = useMemo(() => {
    return featuredBlocks
      .filter((b) => activeTab === 'all' || b.tab === activeTab)
      .map((b) => ({ ...b, items: b.items.filter(matchesItem) }))
      .filter((b) => b.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, q, dietFilter])

  const visibleLists = useMemo(() => {
    return listBlocks
      .filter((b) => activeTab === 'all' || b.tab === activeTab)
      .map((b) => ({ ...b, items: b.items.filter(matchesItem) }))
      .filter((b) => b.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, q, dietFilter])

  const nothingFound = visibleFeatured.length === 0 && visibleLists.length === 0

  return (
    <section
      aria-labelledby="signature-menu-heading"
      className="bg-white pb-16 pt-28 font-body text-ink sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div className="mx-auto w-full max-w-[1260px] px-6 sm:px-10">
        {/* Printed-style Header Row */}
        <Reveal className="flex flex-col justify-between gap-6 border-b border-sun/70 pb-8 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3.5">
            <img
              src="/images/logo-icon.webp"
              alt="G'Host Villa logo"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1
                id="signature-menu-heading"
                className="font-display text-2xl font-extrabold uppercase tracking-[-0.03em] text-ink sm:text-3xl"
              >
                G&apos;Host Villa
              </h1>
              <p className="font-display text-base font-medium italic text-ink/70 sm:text-lg">
                Mountain-view kitchen
              </p>
            </div>
          </div>

          <ul className="space-y-1 text-xs font-medium text-ink/75 sm:text-right">
            <li className="flex items-center gap-2 sm:justify-end">
              <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
              <span>{currentSite.hours}</span>
            </li>
            <li className="flex items-center gap-2 sm:justify-end">
              <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
              <a
                href={currentTel}
                className="underline-offset-4 transition-colors hover:text-ink hover:underline hover:decoration-sun"
              >
                {currentSite.phoneDisplay}
              </a>
            </li>
          </ul>
        </Reveal>

        {/* Category Tabs & Veg / Non-Veg Filter Bar */}
        <div className="mt-8 space-y-4 border-b border-ink/10 pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <label className="relative flex w-full items-center sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink/45"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu..."
                aria-label="Search the menu"
                className="w-full rounded-full border border-ink/15 bg-white py-2 pl-10 pr-9 text-sm text-ink placeholder:text-ink/45 focus:border-forest focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 text-ink/45 hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>

            {/* Veg / Non-Veg Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDietFilter('all')}
                aria-pressed={dietFilter === 'all'}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  dietFilter === 'all'
                    ? 'border-forest bg-forest text-white'
                    : 'border-ink/15 bg-white text-ink/75 hover:border-ink/35 hover:text-ink'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietFilter((d) => (d === 'veg' ? 'all' : 'veg'))}
                aria-pressed={dietFilter === 'veg'}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  dietFilter === 'veg'
                    ? 'border-leaf bg-leaf text-white'
                    : 'border-ink/15 bg-white text-ink/75 hover:border-leaf/50 hover:text-ink'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${dietFilter === 'veg' ? 'bg-white' : 'bg-leaf'}`}
                  aria-hidden="true"
                />
                Vegetarian
              </button>
              <button
                type="button"
                onClick={() => setDietFilter((d) => (d === 'nonveg' ? 'all' : 'nonveg'))}
                aria-pressed={dietFilter === 'nonveg'}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  dietFilter === 'nonveg'
                    ? 'border-sun-text bg-sun-text text-white'
                    : 'border-ink/15 bg-white text-ink/75 hover:border-sun-text/50 hover:text-ink'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${dietFilter === 'nonveg' ? 'bg-white' : 'bg-sun-text'}`}
                  aria-hidden="true"
                />
                Non-veg
              </button>

              {(activeTab !== 'all' || query || dietFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all')
                    setQuery('')
                    setDietFilter('all')
                  }}
                  className="ml-1 text-xs font-semibold text-ink/60 underline decoration-sun underline-offset-4 hover:text-ink"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <nav
            aria-label="Menu categories"
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pt-1"
          >
            {menuTabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-forest text-white'
                      : 'border border-ink/15 bg-white text-ink/75 hover:border-forest/40 hover:text-ink'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[0.68rem] ${active ? 'text-white/75' : 'text-ink/45'}`}
                  >
                    {tabCounts[tab.id] || 0}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Empty Filter State */}
        {nothingFound && (
          <div className="py-16 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              No matching items found.
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Try clearing your search or switching filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all')
                setQuery('')
                setDietFilter('all')
              }}
              className="mt-4 rounded-full bg-sun px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-forest-dark transition hover:bg-sun-dark"
            >
              Show full menu
            </button>
          </div>
        )}

        {/* 2-Column Printed Menu Grid (Items on Left + 1 Plate Photo on Right) */}
        {visibleFeatured.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-2 xl:gap-x-20">
            {visibleFeatured.map((block, index) => (
              <FeaturedCategoryTile key={block.id} block={block} index={index} />
            ))}
          </div>
        )}

        {/* Editorial Divider */}
        {visibleFeatured.length > 0 && visibleLists.length > 0 && (
          <div className="my-14 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="h-1.5 w-1.5 rotate-45 bg-sun" />
            <div className="h-px flex-1 bg-ink/10" />
          </div>
        )}

        {/* Bottom 2-Column Printed Text Lists (Soup/Salad, Hot Drinks, Coolers, Bar) */}
        {visibleLists.length > 0 && (
          <div
            className={`${visibleFeatured.length > 0 ? '' : 'mt-12'} grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2 xl:gap-x-20`}
          >
            {visibleLists.map((block) => (
              <PrintedListTile key={block.id} block={block} />
            ))}
          </div>
        )}

        {/* Printed Footer Line */}
        <Reveal className="mt-16 border-t border-sun/60 pt-7">
          <p className="text-xs font-medium text-ink/70">
            Follow us on{' '}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-sun underline-offset-4 transition-colors hover:text-forest"
            >
              Instagram
            </a>{' '}
            and{' '}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-sun underline-offset-4 transition-colors hover:text-forest"
            >
              Facebook
            </a>{' '}
            for special offers.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import { CustomSelect, Reveal } from './ui.jsx'
import { featuredBlocks as staticFeatured, listBlocks as staticLists, menuTabs as staticTabs } from '../data/signature.js'
import { site, telLink } from '../data/site.js'
import { backendMediaUrl, useBackendData } from '../lib/backend.jsx'

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

/** Uniform equal-height menu category card. */
function FeaturedCategoryTile({ block, index }) {
  return (
    <Reveal
      delay={Math.min((index % 2) * 0.05, 0.1)}
      className="group flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-6 shadow-soft transition-colors duration-300 hover:border-forest/35 sm:p-7"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-ink sm:text-2xl">
            {block.title}
          </h2>
          <div className="mt-2 h-[1.5px] w-10 bg-sun" aria-hidden="true" />
          {block.note && (
            <p className="mt-1.5 text-[0.72rem] font-medium text-ink/50">
              {block.note}
            </p>
          )}
        </div>

        {block.image && (
          <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
            <img
              src={backendMediaUrl(block.image)}
              alt={`${block.title} plated dish`}
              width={900}
              height={900}
              loading="lazy"
              className="aspect-square h-full w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:rotate-[3deg] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            />
          </div>
        )}
      </div>

      <ul className="mt-4 space-y-1.5">
        {block.items.map((item) => (
          <ItemRow key={item.name} item={item} />
        ))}
      </ul>
    </Reveal>
  )
}

/** Uniform equal-height bottom text list card (Soup/Salad, Hot Drinks, Coolers, Bar). */
function PrintedListTile({ block, index }) {
  return (
    <Reveal
      delay={Math.min((index % 2) * 0.05, 0.1)}
      className="flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-6 shadow-soft transition-colors duration-300 hover:border-forest/35 sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-ink sm:text-2xl">
            {block.title}
          </h2>
          <div className="mt-2 h-[1.5px] w-10 bg-sun" aria-hidden="true" />
        </div>
        {block.note && (
          <span className="text-[0.72rem] font-medium text-ink/50">
            {block.note}
          </span>
        )}
      </div>

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
  const menuSettings = backend?.menu?.settings ?? {}
  const backendCats = backend?.menu?.categories
  const hasBackendMenu = backendCats?.some((c) => c.groups?.some((g) => g.displaySection))
  const { menuTabs, featuredBlocks, listBlocks } = useMemo(() => {
    if (!hasBackendMenu) return { menuTabs: staticTabs, featuredBlocks: staticFeatured, listBlocks: staticLists }
    const blocks = backendCats.flatMap((c) => c.groups.map((g) => ({
      ...g,
      tab: c.id,
      items: g.items.map((it) => ({ ...it, price: it.priceText || it.price || '' })),
    })))
    return {
      menuTabs: [{ id: 'all', label: 'All' }, ...backendCats.map((c) => ({ id: c.id, label: c.label }))],
      featuredBlocks: blocks.filter((b) => b.displaySection !== 'list'),
      listBlocks: blocks.filter((b) => b.displaySection === 'list'),
    }
  }, [backendCats, hasBackendMenu])
  const currentTel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const instagramUrl = currentSite.social?.instagram || site.social.instagram
  const facebookUrl = currentSite.social?.facebook || site.social.facebook

  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const [dietFilter, setDietFilter] = useState('all') // 'all' | 'veg' | 'nonveg'
  const [isCompact, setIsCompact] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const miniBarRef = useRef(null)

  useEffect(() => {
    if (!miniBarRef.current) return undefined
    const dockY = window.scrollY + miniBarRef.current.getBoundingClientRect().top
    const onScroll = () => setIsCompact(window.scrollY >= dockY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
  }, [q, dietFilter, menuTabs, featuredBlocks, listBlocks])

  const visibleFeatured = useMemo(() => {
    return featuredBlocks
      .filter((b) => activeTab === 'all' || b.tab === activeTab)
      .map((b) => ({ ...b, items: b.items.filter(matchesItem) }))
      .filter((b) => b.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, q, dietFilter, featuredBlocks])

  const visibleLists = useMemo(() => {
    return listBlocks
      .filter((b) => activeTab === 'all' || b.tab === activeTab)
      .map((b) => ({ ...b, items: b.items.filter(matchesItem) }))
      .filter((b) => b.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, q, dietFilter, listBlocks])

  const nothingFound = visibleFeatured.length === 0 && visibleLists.length === 0
  const activeTabLabel = menuTabs.find((t) => t.id === activeTab)?.label || 'All categories'
  const dietLabel = dietFilter === 'veg' ? 'Vegetarian' : dietFilter === 'nonveg' ? 'Non-veg' : 'All diets'
  const activeCount = tabCounts[activeTab] || 0
  const hasActiveFilters = activeTab !== 'all' || Boolean(query.trim()) || dietFilter !== 'all'

  const resetFilters = () => {
    setActiveTab('all')
    setQuery('')
    setDietFilter('all')
  }

  return (
    <section
      aria-labelledby="signature-menu-heading"
      className="bg-white pb-16 pt-[4.5rem] font-body text-ink sm:pb-20 lg:pb-24"
    >
      <h1 id="signature-menu-heading" className="sr-only">
        {menuSettings.kitchenTitle || "G'Host Villa Menu"}
      </h1>

      {/* Sticky Mini-Menu Filter Bar (matches /rooms BookingBar) */}
      <div
        ref={miniBarRef}
        className={`sticky top-0 z-30 border-b border-forest/10 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isCompact ? 'shadow-md shadow-forest/5' : ''
        }`}
      >
        {/* Mobile compact mini-menu pill */}
        <div className="px-5 py-2 sm:px-8 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen((o) => !o)}
            aria-expanded={mobileFilterOpen}
            className="flex w-full items-center justify-between gap-3 rounded-full border border-forest/15 bg-white px-4 py-2.5 text-left shadow-soft"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun text-forest-dark">
                <Search className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-forest">
                  {query.trim() ? `“${query.trim()}”` : activeTabLabel}
                </span>
                <span className="block truncate text-[0.7rem] text-forest/60">
                  {dietLabel} · {activeCount} {activeCount === 1 ? 'item' : 'items'}
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-forest/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-forest">
              {mobileFilterOpen ? (
                <>
                  <X className="h-3 w-3" aria-hidden="true" />
                  Close
                </>
              ) : (
                <>
                  <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
                  Filter
                </>
              )}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {mobileFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div className="mt-2.5 grid gap-px rounded-2xl border border-forest/15 bg-forest/15 p-px shadow-soft">
                  <div className="rounded-t-2xl bg-white px-4 py-3">
                    <span className="block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/55">
                      Category
                    </span>
                    <CustomSelect
                      ariaLabel="Menu category"
                      value={activeTab}
                      onChange={setActiveTab}
                      options={menuTabs.map((t) => ({
                        value: t.id,
                        label: `${t.label} (${tabCounts[t.id] || 0})`,
                      }))}
                      triggerClassName="mt-1 text-sm font-semibold text-forest"
                    />
                  </div>

                  <div className="bg-white px-4 py-3">
                    <span className="block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/55">
                      Dietary preference
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'veg', label: 'Vegetarian', dot: 'bg-leaf' },
                        { id: 'nonveg', label: 'Non-veg', dot: 'bg-sun-text' },
                      ].map((opt) => {
                        const on = dietFilter === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDietFilter(opt.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                              on
                                ? 'border-forest bg-forest text-white'
                                : 'border-forest/15 bg-white text-forest/75'
                            }`}
                          >
                            {opt.dot && (
                              <span
                                className={`h-2 w-2 rounded-full ${on ? 'bg-white' : opt.dot}`}
                                aria-hidden="true"
                              />
                            )}
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-white px-4 py-3">
                    <span className="block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/55">
                      Search dish or drink
                    </span>
                    <div className="relative mt-1 flex items-center">
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Momo, thali, pizza, tea..."
                        aria-label="Search the menu"
                        className="w-full bg-transparent pr-7 text-sm font-semibold text-forest outline-none placeholder:font-normal placeholder:text-forest/40"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          aria-label="Clear search"
                          className="absolute right-0 text-forest/45 hover:text-forest"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-b-2xl bg-white p-2.5">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="min-h-10 rounded-full border border-forest/20 px-4 text-xs font-semibold text-forest"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="min-h-10 flex-1 rounded-full bg-sun px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-sun-dark"
                    >
                      Show {activeCount} {activeCount === 1 ? 'item' : 'items'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop horizontal mini-menu bar */}
        <div
          className={`relative mx-auto hidden ${
            isCompact ? 'max-w-[1140px]' : 'max-w-[1260px]'
          } px-6 transition-all duration-300 sm:px-10 md:grid md:grid-cols-[1.15fr_1.15fr_1.2fr_auto] md:divide-x md:divide-forest/10`}
        >
          {/* Cell 1: Category Dropdown */}
          <div className={`pr-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>
            <span
              className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${
                isCompact ? 'hidden' : ''
              }`}
            >
              Category
            </span>
            <CustomSelect
              ariaLabel="Menu category"
              value={activeTab}
              onChange={setActiveTab}
              options={menuTabs.map((t) => ({
                value: t.id,
                label: `${t.label} (${tabCounts[t.id] || 0})`,
              }))}
              triggerClassName={`${isCompact ? '' : 'mt-1'} text-sm font-semibold text-forest`}
            />
          </div>

          {/* Cell 2: Dietary Filter */}
          <div className={`px-5 transition-all duration-300 ${isCompact ? 'py-2' : 'py-3.5'}`}>
            <span
              className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${
                isCompact ? 'hidden' : ''
              }`}
            >
              Dietary
            </span>
            <div className={`${isCompact ? '' : 'mt-1.5'} flex items-center gap-1.5`}>
              <button
                type="button"
                onClick={() => setDietFilter('all')}
                aria-pressed={dietFilter === 'all'}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  dietFilter === 'all'
                    ? 'border-forest bg-forest text-white'
                    : 'border-forest/15 bg-white text-forest/75 hover:border-forest/35 hover:text-forest'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietFilter((d) => (d === 'veg' ? 'all' : 'veg'))}
                aria-pressed={dietFilter === 'veg'}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  dietFilter === 'veg'
                    ? 'border-leaf bg-leaf text-white'
                    : 'border-forest/15 bg-white text-forest/75 hover:border-leaf/50 hover:text-forest'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${dietFilter === 'veg' ? 'bg-white' : 'bg-leaf'}`}
                  aria-hidden="true"
                />
                Veg
              </button>
              <button
                type="button"
                onClick={() => setDietFilter((d) => (d === 'nonveg' ? 'all' : 'nonveg'))}
                aria-pressed={dietFilter === 'nonveg'}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  dietFilter === 'nonveg'
                    ? 'border-sun-text bg-sun-text text-white'
                    : 'border-forest/15 bg-white text-forest/75 hover:border-sun-text/50 hover:text-forest'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${dietFilter === 'nonveg' ? 'bg-white' : 'bg-sun-text'}`}
                  aria-hidden="true"
                />
                Non-veg
              </button>
            </div>
          </div>

          {/* Cell 3: Search Input */}
          <label className={`block px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>
            <span
              className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${
                isCompact ? 'hidden' : ''
              }`}
            >
              Search menu
            </span>
            <div className={`${isCompact ? '' : 'mt-1'} relative flex items-center`}>
              <Search className="mr-2 h-4 w-4 shrink-0 text-forest/45" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Momo, thali, pizza, coffee..."
                aria-label="Search the menu"
                className="w-full bg-transparent pr-6 text-sm font-semibold text-forest outline-none placeholder:font-normal placeholder:text-forest/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-0 text-forest/45 hover:text-forest"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </label>

          {/* Cell 4: Count / Reset */}
          <div className="flex items-center gap-2.5 py-2 pl-5">
            <span className="whitespace-nowrap rounded-full bg-sun px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white">
              {activeCount} {activeCount === 1 ? 'item' : 'items'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                aria-label="Reset menu filters"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1260px] px-6 pt-6 sm:px-10">
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 text-xs font-medium text-ink/70">
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
            <span>{currentSite.hours}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
            <a
              href={currentTel}
              className="underline-offset-4 transition-colors hover:text-ink hover:underline hover:decoration-sun"
            >
              {currentSite.phoneDisplay}
            </a>
          </span>
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
              className="mt-4 rounded-full bg-sun px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sun-dark"
            >
              Show full menu
            </button>
          </div>
        )}

        {/* Uniform Equal-Height 2-Column Menu Grid */}
        {visibleFeatured.length > 0 && (
          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-7">
            {visibleFeatured.map((block, index) => (
              <FeaturedCategoryTile key={block.id} block={block} index={index} />
            ))}
          </div>
        )}

        {/* Editorial Divider */}
        {visibleFeatured.length > 0 && visibleLists.length > 0 && (
          <div className="my-12 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="h-1.5 w-1.5 rotate-45 bg-sun" />
            <div className="h-px flex-1 bg-ink/10" />
          </div>
        )}

        {/* Uniform Equal-Height Bottom 2-Column Lists */}
        {visibleLists.length > 0 && (
          <div
            className={`${visibleFeatured.length > 0 ? '' : 'mt-10'} grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-7`}
          >
            {visibleLists.map((block, index) => (
              <PrintedListTile key={block.id} block={block} index={index} />
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

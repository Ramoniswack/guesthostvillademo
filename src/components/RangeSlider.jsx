'use client'

// Slide bar used by the rooms filters.
//   <RangeSlider min={0} max={25000} step={500} value={[low, high]} onChange={([low, high]) => ...} />  two handles
//   <RangeSlider min={0} max={30} step={1} value={guests} onChange={(n) => ...} />                       one handle
// Two native <input type="range"> sit on top of each other, so keyboard, touch and screen readers all work.

const pct = (v, min, max) => ((v - min) / (max - min)) * 100

const thumb =
  'pointer-events-none absolute inset-0 h-7 w-full appearance-none bg-transparent outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-forest ' +
  '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft active:[&::-webkit-slider-thumb]:cursor-grabbing ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 sm:[&::-moz-range-thumb]:h-5 sm:[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-grab ' +
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-forest [&::-moz-range-thumb]:bg-white ' +
  'focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-sun/50 focus-visible:[&::-moz-range-thumb]:ring-4'

export default function RangeSlider({ min = 0, max = 100, step = 1, value, onChange, labels = ['Minimum', 'Maximum'] }) {
  const dual = Array.isArray(value)
  const [lo, hi] = dual ? value : [min, value]
  const left = dual ? pct(lo, min, max) : 0
  const right = pct(hi, min, max)

  return (
    <div className="relative h-7 select-none touch-none">
      <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-forest/15" />
      <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sun" style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }} />
      {dual && (
        <input
          type="range" min={min} max={max} step={step} value={lo} aria-label={labels[0]}
          onChange={(event) => onChange([Math.min(Number(event.target.value), hi - step), hi])}
          className={`${thumb} ${lo > max - step * 2 ? 'z-20' : 'z-10'}`}
        />
      )}
      <input
        type="range" min={min} max={max} step={step} value={hi} aria-label={dual ? labels[1] : labels[0]}
        onChange={(event) => onChange(dual ? [lo, Math.max(Number(event.target.value), lo + step)] : Number(event.target.value))}
        className={`${thumb} z-10`}
      />
    </div>
  )
}

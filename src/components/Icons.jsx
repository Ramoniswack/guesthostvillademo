'use client'

// Icons come from lucide-react. Usage anywhere: <Icon name="leaf" className="h-5 w-5" />
// To use another Lucide icon, import it and add it to the MAP below.
import {
  ArrowUpRight, Bath, BedDouble, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Coffee, Download,
  DoorOpen, Droplet, Flame, Footprints, Globe, Leaf, Mail, MapPin, Menu, MessageCircle, Mountain,
  Navigation, Phone, Search, Snowflake, Star, TreePine, Utensils, Wifi, X,
} from 'lucide-react'

// Lucide 1.x no longer ships brand logos, so these two are tiny inline SVGs.
const Instagram = ({ size, strokeWidth, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" />
  </svg>
)
const Facebook = ({ size, strokeWidth, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const MAP = {
  phone: Phone, pin: MapPin, chat: MessageCircle, bed: BedDouble, utensils: Utensils, wifi: Wifi,
  bath: Bath, flame: Flame, snow: Snowflake, coffee: Coffee, door: DoorOpen, drop: Droplet,
  feet: Footprints, mountain: Mountain, pine: TreePine, check: Check, chevron: ChevronDown,
  chevronL: ChevronLeft, chevronR: ChevronRight, arrow: ArrowUpRight, menu: Menu, close: X,
  search: Search, download: Download, leaf: Leaf, nav: Navigation, clock: Clock, mail: Mail,
  insta: Instagram, fb: Facebook, globe: Globe,
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, ...rest }) {
  const Cmp = MAP[name]
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />
}

export function Stars({ n = 5, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5 text-sun" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className={className} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
      ))}
    </span>
  )
}

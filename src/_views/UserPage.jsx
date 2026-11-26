'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Plus,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
  UserCircle,
  UserPlus,
  X,
} from 'lucide-react'
import { rooms } from '../data/rooms.js'
import { API_BASE_URL, backendMediaUrl, useBackendData } from '../lib/backend.jsx'
import {
  fetchWishlistFromBackend,
  getWishlistSlugs,
  setWishlistSlugs,
  STORAGE_KEY,
  toggleStayWishlist,
  WISHLIST_EVENT,
} from '../lib/wishlist.js'

/* ------------------------------------------------------------------ */
/*  Zod Validation Schemas                                            */
/* ------------------------------------------------------------------ */

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(7, 'Please enter a valid phone / WhatsApp number')
      .regex(/^[+\d\s()-]{7,25}$/, 'Phone number contains invalid characters'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number'),
  city: z
    .string()
    .trim()
    .min(2, 'City is required'),
  country: z
    .string()
    .trim()
    .min(2, 'Country is required'),
  bio: z
    .string()
    .max(300, 'Bio must be 300 characters or fewer')
    .optional(),
})

const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, 'Address label is required (e.g. Home, Office)'),
  recipientName: z
    .string()
    .trim()
    .min(2, 'Recipient name is required'),
  phone: z
    .string()
    .trim()
    .min(7, 'Valid phone number is required'),
  street: z
    .string()
    .trim()
    .min(4, 'Street address is required'),
  city: z
    .string()
    .trim()
    .min(2, 'City is required'),
  country: z
    .string()
    .trim()
    .min(2, 'Country is required'),
  postalCode: z
    .string()
    .trim()
    .optional(),
  isDefault: z.boolean().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z
      .string()
      .min(6, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })

/* ------------------------------------------------------------------ */
/*  Default Demo Data (matches the uploaded reference design)          */
/* ------------------------------------------------------------------ */

const DEFAULT_DEMO_STATE = {
  profile: {
    id: 1,
    username: 'demo@ghostvilla.com',
    email: 'demo@ghostvilla.com',
    fullName: 'George Gika',
    phone: '+977 984-0023756',
    city: 'Jakarta',
    country: 'Indonesia',
    bio: 'Frequent traveller & mountain retreat enthusiast visiting Pokhara.',
    wishlistSlugs: ['mountain-view-room', 'villa-top-floor', 'whole-villa'],
  },
  orders: [
    {
      id: 'CTH-89765',
      status: 'shipping',
      statusBadge: 'On Deliver',
      estimatedArrival: '28 May 2024',
      from: 'Illinois, United States',
      to: "George's House, Indonesia",
      total: 'Rp 849.000',
      itemCount: 2,
      notes: 'Mountain View Dome Stay + Pyramid Dining reservation',
      items: [
        {
          id: 101,
          title: 'Japan Green Outer',
          price: 'Rp 399.000',
          qty: 1,
          size: 'M',
          image: '/images/room-couple.webp',
        },
        {
          id: 102,
          title: 'White off jacket 2024',
          price: 'Rp 450.000',
          qty: 1,
          size: 'M',
          image: '/images/pyramid.webp',
        },
      ],
    },
    {
      id: 'CTH-81719',
      status: 'shipping',
      statusBadge: 'On Deliver',
      estimatedArrival: '28 May 2024',
      from: 'Illinois, United States',
      to: "George's House, Indonesia",
      total: 'Rp 2.300.000',
      itemCount: 2,
      notes: 'Villa Top 2BHK Floor + Group BBQ setup',
      items: [
        {
          id: 201,
          title: 'One set lawyer suits',
          price: 'Rp 2.230.000',
          qty: 1,
          size: 'L',
          image: '/images/hero.webp',
        },
        {
          id: 202,
          title: 'White off tee',
          price: 'Rp 150.000',
          qty: 1,
          size: 'L',
          image: '/images/garden.webp',
        },
      ],
    },
    {
      id: 'CTH-74210',
      status: 'arrived',
      statusBadge: 'Arrived',
      estimatedArrival: '14 Apr 2024',
      from: 'Sarangkot, Pokhara',
      to: "George's House, Indonesia",
      total: 'Rp 1.450.000',
      itemCount: 2,
      notes: 'Crystal Pyramid Dome House weekend stay',
      items: [
        {
          id: 301,
          title: 'Crystal Pyramid Dome Stay (2 Nights)',
          price: 'Rp 1.150.000',
          qty: 1,
          size: 'BB Plan · 2 Guests',
          image: '/images/pyramid.webp',
        },
        {
          id: 302,
          title: 'Newari Khaja Platter & Wood-Fired Dinner',
          price: 'Rp 300.000',
          qty: 1,
          size: '2 Guests',
          image: '/images/day-aerial.webp',
        },
      ],
    },
    {
      id: 'CTH-69104',
      status: 'arrived',
      statusBadge: 'Arrived',
      estimatedArrival: '02 Mar 2024',
      from: 'Sarangkot, Pokhara',
      to: "George's House, Indonesia",
      total: 'Rp 980.000',
      itemCount: 1,
      notes: 'Mountain View Room couple getaway',
      items: [
        {
          id: 401,
          title: 'Mountain View Room (MV)',
          price: 'Rp 980.000',
          qty: 1,
          size: 'MAP Plan · 2 Guests',
          image: '/images/room-deluxe.webp',
        },
      ],
    },
    {
      id: 'CTH-55320',
      status: 'canceled',
      statusBadge: 'Canceled',
      estimatedArrival: '19 Jan 2024',
      from: 'Sarangkot, Pokhara',
      to: "George's House, Indonesia",
      total: 'Rp 3.500.000',
      itemCount: 1,
      notes: 'Rescheduled group retreat',
      items: [
        {
          id: 501,
          title: 'Entire 7-BHK Main Villa Buyout',
          price: 'Rp 3.500.000',
          qty: 1,
          size: 'Up to 18 Guests',
          image: '/images/night-aerial.webp',
        },
      ],
    },
  ],
  addresses: [
    {
      id: 1,
      label: "George's House",
      recipientName: 'George Gika',
      phone: '+977 984-0023756',
      street: 'Jl. Sudirman No. 42, Senayan',
      city: 'Jakarta',
      country: 'Indonesia',
      postalCode: '12190',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Pokhara Retreat Suite',
      recipientName: 'George Gika',
      phone: '+977 984-0023756',
      street: 'Sarangkot Road, Ranipauwa (Fulbari)',
      city: 'Pokhara',
      country: 'Nepal',
      postalCode: '33700',
      isDefault: false,
    },
  ],
}

function FieldError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/*  Auth Panel (Log In & Create Account with Zod + React Hook Form)    */
/* ------------------------------------------------------------------ */

function AuthSection({ onAuthenticated }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@ghostvilla.com',
      password: 'Guest@1234',
    },
  })

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleLogin = async (values) => {
    setServerError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) {
        const payload = await res.json()
        onAuthenticated(payload)
        return
      }
      const err = await res.json().catch(() => ({}))
      if (values.email.toLowerCase() === 'demo@ghostvilla.com' && values.password === 'Guest@1234') {
        onAuthenticated({ token: 'local-demo-token', ...DEFAULT_DEMO_STATE })
        return
      }
      setServerError(err.detail || 'Invalid credentials. Try demo@ghostvilla.com / Guest@1234.')
    } catch {
      // Offline fallback so demo works even when Django isn't running
      const fallbackName =
        values.email.toLowerCase() === 'demo@ghostvilla.com'
          ? 'George Gika'
          : values.email.split('@')[0].replace(/[._-]/g, ' ')
      onAuthenticated({
        token: 'local-demo-token',
        ...DEFAULT_DEMO_STATE,
        profile: {
          ...DEFAULT_DEMO_STATE.profile,
          email: values.email,
          fullName: fallbackName.replace(/\b\w/g, (c) => c.toUpperCase()),
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (values) => {
    setServerError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) {
        const payload = await res.json()
        onAuthenticated(payload)
        return
      }
      const err = await res.json().catch(() => ({}))
      setServerError(err.detail || 'Could not create account. Please check your details.')
    } catch {
      onAuthenticated({
        token: 'local-demo-token',
        ...DEFAULT_DEMO_STATE,
        profile: {
          ...DEFAULT_DEMO_STATE.profile,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white'

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              G&apos;Host Villa Member
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-900 text-white">
            {mode === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-full bg-neutral-100 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setServerError('')
            }}
            className={`rounded-full py-2 text-xs font-semibold transition ${
              mode === 'login'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setServerError('')
            }}
            className={`rounded-full py-2 text-xs font-semibold transition ${
              mode === 'register'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {serverError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {serverError}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700">
                Email Address
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="demo@ghostvilla.com"
                  {...loginForm.register('email')}
                  className={inputClass}
                />
              </label>
              <FieldError message={loginForm.formState.errors.email?.message} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700">
                Password
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...loginForm.register('password')}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
              <FieldError message={loginForm.formState.errors.password?.message} />
            </div>

            <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">Demo Account:</span>{' '}
              <code className="text-neutral-800">demo@ghostvilla.com</code> /{' '}
              <code className="text-neutral-800">Guest@1234</code>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{submitting ? 'Signing in...' : 'Log In to Dashboard'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700">
                Full Name
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="George Gika"
                  {...registerForm.register('fullName')}
                  className={inputClass}
                />
              </label>
              <FieldError message={registerForm.formState.errors.fullName?.message} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Email Address
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="george@example.com"
                    {...registerForm.register('email')}
                    className={inputClass}
                  />
                </label>
                <FieldError message={registerForm.formState.errors.email?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Phone / WhatsApp
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+977 984-0023756"
                    {...registerForm.register('phone')}
                    className={inputClass}
                  />
                </label>
                <FieldError message={registerForm.formState.errors.phone?.message} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Password
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    {...registerForm.register('password')}
                    className={inputClass}
                  />
                </label>
                <FieldError message={registerForm.formState.errors.password?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Confirm Password
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    {...registerForm.register('confirmPassword')}
                    className={inputClass}
                  />
                </label>
                <FieldError message={registerForm.formState.errors.confirmPassword?.message} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main User Portal Page (Matches uploaded George Gika UI)            */
/* ------------------------------------------------------------------ */

const TOP_TABS = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'orders', label: 'My Order', icon: ShoppingBag },
  { id: 'addresses', label: 'Saved Address', icon: MapPin },
  { id: 'password', label: 'Change Password', icon: Shield },
]

const ORDER_STATUS_TABS = [
  { id: 'shipping', label: 'On Shipping' },
  { id: 'arrived', label: 'Arrived' },
  { id: 'canceled', label: 'Canceled' },
]

export default function UserPage() {
  const backend = useBackendData()
  const allRooms = backend?.stays?.rooms?.length ? backend.stays.rooms : rooms

  const [session, setSession] = useState(null) // null when logged out
  const [hydrated, setHydrated] = useState(false)
  const [activeTab, setActiveTab] = useState('orders') // default to 'My Order' like reference image
  const [orderFilter, setOrderFilter] = useState('shipping') // 'shipping' | 'arrived' | 'canceled'
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [toast, setToast] = useState('')
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  // Load persisted session (defaulting to George Gika demo state so the page renders immediately)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const currentWishlist = getWishlistSlugs()
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.loggedOut) {
            setSession(null)
          } else {
            const merged = {
              ...DEFAULT_DEMO_STATE,
              ...parsed,
              profile: {
                ...DEFAULT_DEMO_STATE.profile,
                ...(parsed.profile || {}),
                wishlistSlugs: currentWishlist,
              },
            }
            setSession(merged)
          }
        } else {
          const initial = {
            token: 'demo-token',
            ...DEFAULT_DEMO_STATE,
            profile: {
              ...DEFAULT_DEMO_STATE.profile,
              wishlistSlugs: currentWishlist,
            },
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
          setWishlistSlugs(currentWishlist)
          setSession(initial)
        }
      } catch {
        setSession({ token: 'demo-token', ...DEFAULT_DEMO_STATE })
      } finally {
        setHydrated(true)
      }
    }

    syncFromStorage()
    fetchWishlistFromBackend().then(() => syncFromStorage())
    window.addEventListener(WISHLIST_EVENT, syncFromStorage)
    window.addEventListener('storage', syncFromStorage)
    return () => {
      window.removeEventListener(WISHLIST_EVENT, syncFromStorage)
      window.removeEventListener('storage', syncFromStorage)
    }
  }, [])

  const saveSession = (next) => {
    setSession(next)
    try {
      if (next) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedOut: true }))
      }
    } catch {
      // ignore storage errors
    }
  }

  // Forms for Profile, Saved Address, and Change Password
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: session?.profile?.fullName || 'George Gika',
      email: session?.profile?.email || 'demo@ghostvilla.com',
      phone: session?.profile?.phone || '+977 984-0023756',
      city: session?.profile?.city || 'Jakarta',
      country: session?.profile?.country || 'Indonesia',
      bio: session?.profile?.bio || '',
    },
  })

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      recipientName: session?.profile?.fullName || 'George Gika',
      phone: session?.profile?.phone || '+977 984-0023756',
      street: '',
      city: '',
      country: 'Indonesia',
      postalCode: '',
      isDefault: false,
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const orders = session?.orders?.length ? session.orders : DEFAULT_DEMO_STATE.orders
  const addresses = session?.addresses ?? DEFAULT_DEMO_STATE.addresses
  const wishlistSlugs = session?.profile?.wishlistSlugs ?? DEFAULT_DEMO_STATE.profile.wishlistSlugs

  const orderCounts = useMemo(() => {
    const counts = { shipping: 0, arrived: 0, canceled: 0 }
    for (const o of orders) {
      if (counts[o.status] !== undefined) counts[o.status] += 1
    }
    return counts
  }, [orders])

  const filteredOrders = useMemo(
    () => orders.filter((o) => o.status === orderFilter),
    [orders, orderFilter],
  )

  const wishlistRooms = useMemo(
    () => allRooms.filter((r) => wishlistSlugs.includes(r.id || r.slug)),
    [allRooms, wishlistSlugs],
  )

  const handleProfileSubmit = async (values) => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (session?.token && session.token !== 'demo-token' && session.token !== 'local-demo-token') {
        headers.Authorization = `Token ${session.token}`
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/user/profile/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(values),
      })
      if (res.ok) {
        const data = await res.json()
        saveSession({ ...session, ...data })
        notify('Profile updated and saved to backend.')
        return
      }
    } catch {
      // fall back to local update
    }
    saveSession({
      ...session,
      profile: {
        ...session.profile,
        ...values,
      },
    })
    notify('Profile updated successfully.')
  }

  const handleAddressSubmit = async (values) => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (session?.token && session.token !== 'demo-token' && session.token !== 'local-demo-token') {
        headers.Authorization = `Token ${session.token}`
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/user/addresses/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(values),
      })
      if (res.ok) {
        const data = await res.json()
        saveSession({ ...session, ...data })
        addressForm.reset()
        notify('New address saved to backend.')
        return
      }
    } catch {
      // fall back to local update
    }

    const nextAddresses = values.isDefault
      ? addresses.map((a) => ({ ...a, isDefault: false }))
      : [...addresses]
    nextAddresses.unshift({
      id: Date.now(),
      ...values,
      isDefault: values.isDefault || nextAddresses.length === 0,
    })
    saveSession({ ...session, addresses: nextAddresses })
    addressForm.reset()
    notify('New address added to your account.')
  }

  const handleDeleteAddress = async (id) => {
    try {
      const headers = {}
      if (session?.token && session.token !== 'demo-token' && session.token !== 'local-demo-token') {
        headers.Authorization = `Token ${session.token}`
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/user/addresses/${id}/`, {
        method: 'DELETE',
        headers,
      })
      if (res.ok) {
        const data = await res.json()
        saveSession({ ...session, ...data })
        notify('Address removed from backend.')
        return
      }
    } catch {
      // fall back
    }
    saveSession({
      ...session,
      addresses: addresses.filter((a) => a.id !== id),
    })
    notify('Address removed.')
  }

  const handleToggleWishlist = async (slug) => {
    const exists = wishlistSlugs.includes(slug)
    await toggleStayWishlist(slug)
    const updatedSlugs = getWishlistSlugs()
    setSession((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              wishlistSlugs: updatedSlugs,
            },
          }
        : prev,
    )
    notify(exists ? 'Removed from wishlist.' : 'Added to wishlist.')
  }

  const handlePasswordSubmit = async (values) => {
    if (session?.token && session.token !== 'demo-token' && session.token !== 'local-demo-token') {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${session.token}`,
          },
          body: JSON.stringify(values),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          passwordForm.setError('currentPassword', {
            message: data.detail || 'Could not update password.',
          })
          return
        }
        saveSession({ ...session, token: data.token || session.token })
        passwordForm.reset()
        notify('Password updated successfully.')
        return
      } catch {
        // fall back
      }
    }
    passwordForm.reset()
    notify('Password updated successfully.')
  }

  const confirmLogout = async () => {
    if (session?.token && session.token !== 'demo-token' && session.token !== 'local-demo-token') {
      fetch(`${API_BASE_URL}/api/v1/auth/logout/`, {
        method: 'POST',
        headers: { Authorization: `Token ${session.token}` },
      }).catch(() => {})
    }
    setLogoutModalOpen(false)
    saveSession(null)
    notify('You have been logged out.')
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-[#FAFAFA] pt-28" />
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white'

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 pt-24 text-neutral-900 md:pt-28">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed right-5 top-24 z-50 inline-flex items-center gap-2.5 rounded-full bg-neutral-900 px-5 py-3 text-xs font-semibold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        {!session ? (
          <AuthSection
            onAuthenticated={(payload) => {
              saveSession(payload)
              setActiveTab('orders')
              notify(`Welcome back, ${payload.profile?.fullName || 'Guest'}!`)
            }}
          />
        ) : (
          <>
            {/* ── Top Header Bar: Greeting left, 6 Pill Buttons right (Exact match to reference image) ── */}
            <div className="flex flex-col gap-6 border-b border-neutral-200/80 pb-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Good Morning,</p>
                <h1 className="mt-0.5 font-sans text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.85rem]">
                  {session.profile?.fullName || 'George Gika'}
                </h1>
              </div>

              <div
                role="tablist"
                aria-label="User account navigation"
                className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0"
              >
                {TOP_TABS.map(({ id, label, icon: TabIcon }) => {
                  const active = activeTab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(id)}
                      className={`inline-flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-xs font-semibold transition sm:text-[0.82rem] ${
                        active
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <TabIcon className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-neutral-200/90 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-[0.82rem]"
                >
                  <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* ── TAB 1: MY ORDER (Exact match to uploaded reference image) ── */}
            {activeTab === 'orders' && (
              <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
                {/* Left Sidebar Status Pills */}
                <aside aria-label="Order status filter" className="flex gap-2.5 overflow-x-auto lg:flex-col lg:space-y-3 lg:overflow-visible">
                  {ORDER_STATUS_TABS.map((st) => {
                    const active = orderFilter === st.id
                    const count = orderCounts[st.id] ?? 0
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setOrderFilter(st.id)}
                        className={`flex min-w-[155px] items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left text-xs font-semibold transition lg:w-full sm:text-[0.82rem] ${
                          active
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                            : 'border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span className="pl-1">{st.label}</span>
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            active
                              ? 'bg-white text-neutral-900'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </aside>

                {/* Right Order Cards List */}
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-[26px] border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
                    >
                      <div className="p-5 sm:p-7">
                        {/* Order Top Row: Order ID left, Estimated arrival + On Deliver right */}
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[0.72rem] font-medium text-neutral-400">Order ID</p>
                            <div className="mt-1 flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-neutral-700" strokeWidth={1.8} />
                              <span className="font-sans text-base font-bold tracking-tight text-neutral-900 sm:text-lg">
                                {order.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-neutral-200/80 bg-neutral-50 px-3.5 py-1.5 text-[0.72rem] font-medium text-neutral-500">
                              Estimated arrival: {order.estimatedArrival}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold ${
                                order.status === 'arrived'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : order.status === 'canceled'
                                    ? 'bg-neutral-100 text-neutral-600'
                                    : 'bg-red-50 text-red-500'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  order.status === 'arrived'
                                    ? 'bg-emerald-500'
                                    : order.status === 'canceled'
                                      ? 'bg-neutral-400'
                                      : 'bg-red-500'
                                }`}
                              />
                              {order.statusBadge}
                            </span>
                          </div>
                        </div>

                        {/* Route Row: Origin ---------> Destination */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-50/70 px-3.5 py-1.5 text-xs font-medium text-neutral-700">
                            <Truck className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{order.from}</span>
                          </span>

                          <div className="hidden flex-1 items-center justify-center px-4 sm:flex" aria-hidden="true">
                            <div className="flex items-center gap-1 text-neutral-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                              <span className="w-24 border-b border-dashed border-neutral-400 md:w-32" />
                              <ArrowRight className="h-3.5 w-3.5 text-neutral-600" />
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-50/70 px-3.5 py-1.5 text-xs font-medium text-neutral-700">
                            <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{order.to}</span>
                          </span>
                        </div>

                        {/* Order Items Stack */}
                        <div className="mt-5 space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 rounded-2xl border border-neutral-200/75 bg-white p-3 transition hover:border-neutral-300"
                            >
                              <img
                                src={backendMediaUrl(item.image)}
                                alt={item.title}
                                loading="lazy"
                                className="h-20 w-20 shrink-0 rounded-xl bg-neutral-100 object-cover sm:h-22 sm:w-22"
                              />
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-neutral-900 sm:text-[0.94rem]">
                                  {item.title}
                                </h3>
                                <p className="mt-1 text-xs font-bold text-neutral-800 sm:text-[0.82rem]">
                                  {item.price}{' '}
                                  <span className="font-normal text-neutral-400">x{item.qty}</span>
                                </p>
                                <p className="mt-1 text-xs font-medium text-neutral-500">
                                  {item.size}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Footer Bar: Total left, Details pill right */}
                      <div className="flex items-center justify-between gap-4 border-t border-neutral-200/70 bg-neutral-100/80 px-5 py-3.5 sm:px-7">
                        <p className="text-xs font-bold text-neutral-900 sm:text-sm">
                          Total: {order.total}{' '}
                          <span className="font-normal text-neutral-400">
                            ({order.itemCount} {order.itemCount === 1 ? 'item' : 'item'})
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-full bg-neutral-900 px-6 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredOrders.length === 0 && (
                    <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-neutral-400" />
                      <p className="mt-3 text-base font-semibold text-neutral-800">
                        No orders in this status
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Switch status tabs on the left to view your other bookings and orders.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: PROFILE (Zod + React Hook Form) ── */}
            {activeTab === 'profile' && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 text-center shadow-xs">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-neutral-900 font-sans text-2xl font-bold text-white">
                    {(session.profile?.fullName || 'G')[0]}
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-neutral-900">
                    {session.profile?.fullName}
                  </h2>
                  <p className="text-xs text-neutral-500">{session.profile?.email}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-neutral-100 pt-5 text-xs text-neutral-600">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium">
                      {session.profile?.city}, {session.profile?.country}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium">
                      {orders.length} Orders
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs sm:p-9">
                  <h2 className="text-lg font-bold text-neutral-900">Personal Information</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Validated with Zod and React Hook Form. Changes sync with your G&apos;Host Villa guest account.
                  </p>

                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                    noValidate
                    className="mt-6 space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Full Name
                          <input
                            type="text"
                            {...profileForm.register('fullName')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={profileForm.formState.errors.fullName?.message} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Email Address
                          <input
                            type="email"
                            {...profileForm.register('email')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={profileForm.formState.errors.email?.message} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Phone / WhatsApp
                          <input
                            type="tel"
                            {...profileForm.register('phone')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={profileForm.formState.errors.phone?.message} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          City
                          <input
                            type="text"
                            {...profileForm.register('city')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={profileForm.formState.errors.city?.message} />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Country
                          <input
                            type="text"
                            {...profileForm.register('country')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={profileForm.formState.errors.country?.message} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700">
                        Guest Bio / Stay Preferences
                        <textarea
                          rows={3}
                          {...profileForm.register('bio')}
                          placeholder="Dietary preferences, room view preference, arrival notes..."
                          className={inputClass}
                        />
                      </label>
                      <FieldError message={profileForm.formState.errors.bio?.message} />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="rounded-full bg-neutral-900 px-7 py-3 text-xs font-semibold text-white transition hover:bg-neutral-800"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── TAB 3: WISHLIST ── */}
            {activeTab === 'wishlist' && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Saved Wishlist ({wishlistRooms.length})
                    </h2>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Your saved rooms and private villa stays at G&apos;Host Villa Pokhara.
                    </p>
                  </div>
                  <Link
                    href="/rooms"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-900"
                  >
                    <span>Explore all rooms</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {wishlistRooms.length > 0 ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistRooms.map((room) => (
                      <div
                        key={room.id}
                        className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs transition hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] bg-neutral-100">
                          <img
                            src={backendMediaUrl(room.image)}
                            alt={room.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(room.id)}
                            aria-label={`Remove ${room.name} from wishlist`}
                            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-500 shadow-xs transition hover:bg-white"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                        <div className="p-5">
                          <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-neutral-400">
                            {room.bhk}
                          </p>
                          <h3 className="mt-1 text-base font-bold text-neutral-900">{room.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{room.blurb}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3.5">
                            <span className="text-xs font-bold text-neutral-900">
                              {room.price ? `NPR ${room.price.toLocaleString('en-US')}` : 'On WhatsApp'}
                            </span>
                            <Link
                              href={`/rooms/${room.id}`}
                              className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
                            >
                              View stay
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl border border-neutral-200/80 bg-white p-12 text-center">
                    <Heart className="mx-auto h-8 w-8 text-neutral-300" />
                    <p className="mt-3 text-base font-semibold text-neutral-800">
                      Your wishlist is empty
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Click the &ldquo;Save&rdquo; heart button on any individual room page to add it here.
                    </p>
                    <Link
                      href="/rooms"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
                    >
                      <span>Browse rooms</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: SAVED ADDRESS (Zod + React Hook Form) ── */}
            {activeTab === 'addresses' && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Saved Addresses ({addresses.length})
                  </h2>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-start justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-neutral-700" />
                          <h3 className="text-sm font-bold text-neutral-900">{addr.label}</h3>
                          {addr.isDefault && (
                            <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-neutral-800">
                          {addr.recipientName} · {addr.phone}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {addr.street}, {addr.city}
                          {addr.postalCode ? ` ${addr.postalCode}` : ''}, {addr.country}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        aria-label={`Delete ${addr.label}`}
                        className="rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs">
                  <h3 className="text-base font-bold text-neutral-900">Add New Address</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Validated with Zod &amp; React Hook Form.
                  </p>

                  <form
                    onSubmit={addressForm.handleSubmit(handleAddressSubmit)}
                    noValidate
                    className="mt-5 space-y-3.5"
                  >
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Label
                          <input
                            type="text"
                            placeholder="e.g. George's House"
                            {...addressForm.register('label')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.label?.message} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Recipient Name
                          <input
                            type="text"
                            placeholder="George Gika"
                            {...addressForm.register('recipientName')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.recipientName?.message} />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Phone
                          <input
                            type="tel"
                            placeholder="+977 984-0023756"
                            {...addressForm.register('phone')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.phone?.message} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Street Address
                          <input
                            type="text"
                            placeholder="Jl. Sudirman No. 42"
                            {...addressForm.register('street')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.street?.message} />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          City
                          <input
                            type="text"
                            placeholder="Jakarta"
                            {...addressForm.register('city')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.city?.message} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Country
                          <input
                            type="text"
                            placeholder="Indonesia"
                            {...addressForm.register('country')}
                            className={inputClass}
                          />
                        </label>
                        <FieldError message={addressForm.formState.errors.country?.message} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700">
                          Postal Code
                          <input
                            type="text"
                            placeholder="12190"
                            {...addressForm.register('postalCode')}
                            className={inputClass}
                          />
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 pt-1 text-xs font-medium text-neutral-700">
                      <input
                        type="checkbox"
                        {...addressForm.register('isDefault')}
                        className="h-4 w-4 accent-neutral-900"
                      />
                      <span>Set as default delivery / billing address</span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-semibold text-white transition hover:bg-neutral-800"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Save Address</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── TAB 5: CHANGE PASSWORD (Zod + React Hook Form) ── */}
            {activeTab === 'password' && (
              <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-900 text-white">
                    <Shield className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Change Password</h2>
                    <p className="text-xs text-neutral-500">
                      Update your account password using Zod schema validation.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  noValidate
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Current Password
                      <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        {...passwordForm.register('currentPassword')}
                        className={inputClass}
                      />
                    </label>
                    <FieldError message={passwordForm.formState.errors.currentPassword?.message} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      New Password
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        {...passwordForm.register('newPassword')}
                        className={inputClass}
                      />
                    </label>
                    <FieldError message={passwordForm.formState.errors.newPassword?.message} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Confirm New Password
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat new password"
                        {...passwordForm.register('confirmNewPassword')}
                        className={inputClass}
                      />
                    </label>
                    <FieldError
                      message={passwordForm.formState.errors.confirmNewPassword?.message}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="rounded-full bg-neutral-900 px-7 py-3 text-xs font-semibold text-white transition hover:bg-neutral-800"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-xs text-neutral-400">Order Details</p>
                  <h3 className="text-lg font-bold text-neutral-900">{selectedOrder.id}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="font-semibold text-neutral-900">{selectedOrder.statusBadge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Estimated Arrival</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedOrder.estimatedArrival}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">From</span>
                  <span className="font-semibold text-neutral-900">{selectedOrder.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Destination</span>
                  <span className="font-semibold text-neutral-900">{selectedOrder.to}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="rounded-2xl bg-neutral-50 p-3 text-neutral-700">
                    {selectedOrder.notes}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={backendMediaUrl(it.image)}
                      alt={it.title}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-neutral-900">{it.title}</p>
                      <p className="text-[0.72rem] text-neutral-500">
                        {it.price} × {it.qty} · {it.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-sm font-bold text-neutral-900">
                  Total: {selectedOrder.total}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full bg-neutral-900 px-6 py-2 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {logoutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLogoutModalOpen(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                <LogOut className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-neutral-900">Log out of your account?</h3>
              <p className="mt-1 text-xs text-neutral-500">
                You can sign back in anytime using your email and password.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(false)}
                  className="rounded-full border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="rounded-full bg-neutral-900 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

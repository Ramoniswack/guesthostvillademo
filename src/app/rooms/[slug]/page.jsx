import { notFound } from 'next/navigation'
import RoomDetailPage from '../../../_views/RoomDetailPage.jsx'
import { findStay, rooms } from '../../../data/rooms.js'

export function generateStaticParams() {
  return [
    ...rooms.map((room) => ({ slug: room.slug || room.id })),
    { slug: 'villa-top' },
  ]
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const room = findStay(slug)
  return room
    ? { title: room.name, description: room.intro || room.blurb }
    : { title: 'Room details' }
}

export default async function Page({ params }) {
  const { slug } = await params
  const room = findStay(slug)
  if (!room) notFound()
  return <RoomDetailPage room={room} />
}

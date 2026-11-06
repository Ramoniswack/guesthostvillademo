import { notFound } from 'next/navigation'
import RoomDetailPage from '../../../_views/RoomDetailPage.jsx'
import { rooms } from '../../../data/rooms.js'

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const room = rooms.find((item) => item.id === slug)
  return room ? { title: room.name, description: room.blurb } : { title: 'Room details' }
}

export default async function Page({ params }) {
  const { slug } = await params
  const room = rooms.find((item) => item.id === slug)
  if (!room) notFound()
  return <RoomDetailPage room={room} />
}

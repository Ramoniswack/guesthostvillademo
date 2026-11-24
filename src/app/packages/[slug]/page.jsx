import { notFound } from 'next/navigation'
import PackageDetailPage from '../../../_views/PackageDetailPage.jsx'
import { packages } from '../../../data/packages.js'

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const pkg = packages.find((item) => item.id === slug)
  return pkg
    ? { title: `${pkg.title} · Packages`, description: pkg.intro }
    : { title: 'Package details' }
}

export default async function Page({ params }) {
  const { slug } = await params
  const pkg = packages.find((item) => item.id === slug)
  if (!pkg) notFound()
  return <PackageDetailPage pkg={pkg} />
}

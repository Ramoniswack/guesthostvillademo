/** Static export: `next build` writes a plain site to /out (works on Cloudflare Pages, Netlify, any static host). */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
}
export default nextConfig

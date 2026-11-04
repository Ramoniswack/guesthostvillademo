/** Static export: `next build` writes a plain site to /out (works on Cloudflare Pages, Netlify, any static host). */
const nextConfig = {
  output: 'export',
  distDir: process.env.NEXT_DIST_DIR || '.next',
  trailingSlash: false,
  images: { unoptimized: true },
}
export default nextConfig

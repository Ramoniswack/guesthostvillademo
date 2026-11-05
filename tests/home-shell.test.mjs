import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { test } from 'node:test'

test('the exported home page promotes booking and social discovery', () => {
  rmSync('.next-test', { recursive: true, force: true })
  execFileSync('npm', ['run', 'build'], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, NEXT_DIST_DIR: '.next-test' },
  })

  const page = readFileSync('.next-test/index.html', 'utf8')
  const hero = readFileSync('src/components/Hero.jsx', 'utf8')

  assert.equal(existsSync('.next-test'), true)
  assert.match(page, /Book a stay/)
  assert.match(page, /Follow G(?:&#x27;|')Host Villa/)
  assert.match(page, /https:\/\/wa\.me\/9779840023756/)
  assert.match(page, /aria-label="Footer navigation"/)
  assert.doesNotMatch(page, /h-8 w-8 place-items-center border/)
  assert.match(hero, /const heroMedia/)
  assert.match(hero, /\/images\/day-aerial\.webp/)
  assert.match(hero, /\/images\/garden\.webp/)
  assert.match(hero, /\/images\/pyramid\.webp/)
  assert.match(hero, /setInterval\([^,]+, 3000\)/)
  assert.match(hero, /\/videos\/stock-hero\.mp4/)
  assert.doesNotMatch(hero, /\/videos\/hero-pool\.mp4/)
  assert.match(hero, /onEnded=\{nextSlide\}/)
  assert.match(hero, /cursor-grab/)
  assert.match(hero, /onPointerUp/)
  assert.match(hero, /select-none/)
  const footer = readFileSync('src/components/Footer.jsx', 'utf8')
  assert.match(footer, /const wordmarkLetters = \[\.\.\."G'HOST VILLA"\]/)
  assert.match(footer, /wordmarkLetters\.map/)
  assert.match(footer, /hover:text-sun/)
  assert.match(footer, /hover:\[text-shadow:0_0_24px_rgba\(255,174,41,0\.72\)\]/)
  assert.doesNotMatch(footer, /group-hover:-translate-y-1/)
  const home = readFileSync('src/components/HomeEditorial.jsx', 'utf8')
  assert.doesNotMatch(home, /role="tablist"/)
  assert.match(home, /aria-label="Guest review carousel"/)
  assert.match(home, /activeMoment/)
  const jobs = readFileSync('src/data/jobs.js', 'utf8')
  const layout = readFileSync('src/app/layout.jsx', 'utf8')
  assert.doesNotMatch(jobs, /placeholder/)
  assert.doesNotMatch(layout, /YOUR-DOMAIN/)
})

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

  assert.equal(existsSync('.next-test'), true)
  assert.match(page, /Book a stay/)
  assert.match(page, /Follow G(?:&#x27;|')Host Villa/)
  assert.match(page, /https:\/\/wa\.me\/9779840023756/)
  assert.match(page, /aria-label="Footer navigation"/)
  assert.doesNotMatch(page, /h-8 w-8 place-items-center border/)
})

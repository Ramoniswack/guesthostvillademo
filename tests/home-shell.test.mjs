import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

test('the exported home page promotes booking and social discovery', () => {
  execFileSync('npm', ['run', 'build'], { stdio: 'pipe', shell: true })

  const page = readFileSync('out/index.html', 'utf8')

  assert.match(page, /Book a stay/)
  assert.match(page, /Follow G(?:&#x27;|')Host Villa/)
})

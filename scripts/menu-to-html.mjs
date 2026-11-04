// Generates a printable menu from src/data/menu.js  →  scripts/menu-print.html
// Then print it to PDF (browser: Print → Save as PDF) and save as public/ghost-villa-menu.pdf
import { writeFileSync } from 'node:fs'
import { categories, menuNote } from '../src/data/menu.js'
const npr = (n) => `NPR ${n}`
const item = (i) => {
  const price = i.options ? i.options.map((o) => `${o.label} ${o.price}`).join(' · ') : i.price == null ? 'Ask staff' : npr(i.price)
  return `<div class="i"><b>${i.name}</b>${i.pick ? " <em>★ Chef's pick</em>" : ''}<span>${price}</span>${i.desc ? `<small>${i.desc}</small>` : ''}${i.note ? `<small>${i.note}</small>` : ''}</div>`
}
const html = `<!doctype html><meta charset="utf-8"><title>G'Host Villa Menu</title><style>
@page{size:A4;margin:14mm}body{font:11pt/1.4 Georgia,serif;color:#26302A;background:#FBF7EF}
h1{color:#2F4A3A;margin:0}h2{color:#2F4A3A;border-bottom:2px solid #F7941D;margin:18pt 0 4pt;break-after:avoid}h3{margin:10pt 0 2pt;color:#566F52;font-size:11pt;text-transform:uppercase;letter-spacing:.08em;break-after:avoid}
.i{display:flex;gap:8pt;flex-wrap:wrap;justify-content:space-between;padding:2pt 0;break-inside:avoid}.i b{font-weight:600}.i span{margin-left:auto;font-weight:700}.i small{flex-basis:100%;color:#6B7568}em{color:#E0820E;font-size:9pt}
p.n{color:#6B7568;font-style:italic}</style>
<h1>G'Host Villa · Restro &amp; Bar</h1><p class="n">${menuNote} Sarangkot, Pokhara</p>
${categories.map((c) => `<h2>${c.label}</h2>${c.groups.map((g) => `<h3>${g.title}</h3>${g.note ? `<small>${g.note}</small>` : ''}${g.items.map(item).join('')}`).join('')}`).join('')}`
writeFileSync(new URL('./menu-print.html', import.meta.url), html)
console.log('wrote scripts/menu-print.html')

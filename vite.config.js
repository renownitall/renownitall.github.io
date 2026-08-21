import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Stamp the build date (in Asia/Jakarta) so the footer can show when the site
// was last built. Computed once here at build time, then injected as a string
// literal via `define` so the value updates automatically on every build.
const nth = (day) => {
  if (day >= 11 && day <= 13) return 'th'
  return { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th'
}

const now = new Date()
const parts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Jakarta',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).formatToParts(now)
const month = parts.find((p) => p.type === 'month').value
const day = parts.find((p) => p.type === 'day').value
const year = parts.find((p) => p.type === 'year').value
const buildDate = `${month} ${day}${nth(Number(day))}, ${year}`.toLowerCase()

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Serve from the site root on GitHub Pages, where the user page repo is the site itself.
  base: '/',
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
})

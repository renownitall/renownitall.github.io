import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Serve from the site root on GitHub Pages, where the user page repo is the site itself.
  base: '/',
  // Permit Arena's proxied preview hostname while developing in Agent Mode.
  server: { allowedHosts: true },
})

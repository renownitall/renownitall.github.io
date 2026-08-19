import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Permit Arena's proxied preview hostname while developing in Agent Mode.
  server: { allowedHosts: true },
})

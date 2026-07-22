import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// MT AUTO — buyer front-door (React implementation of the design bundle)
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: { host: true, port: 5173 },
})
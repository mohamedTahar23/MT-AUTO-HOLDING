import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Seller portal dev server on 5174 so it can run alongside the buyer app (5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, host: true },
  preview: { port: 4174 },
})

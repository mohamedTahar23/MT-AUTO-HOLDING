import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MT AUTO — buyer front-door (React implementation of the design bundle)
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
})

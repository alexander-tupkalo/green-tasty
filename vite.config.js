
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/green-tasty/',
  plugins: [react()],
  optimizeDeps: {
    entries: ['index.html'],
  },
})

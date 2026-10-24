import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Restrict dep scanning to our own entry point so Vite does not
  // try to resolve imports from unrelated HTML files elsewhere in the
  // project root (e.g. system skill reference files).
  optimizeDeps: {
    entries: ['index.html'],
  },
})

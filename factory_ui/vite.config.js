import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      // Proxy for logos and other static files from backend
      '/logos': {
        target: 'http://localhost:54465',
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,
      },
      // Proxy for API calls if needed
      '/api': {
        target: 'http://localhost:54465',
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,
      },
    }
  }
})

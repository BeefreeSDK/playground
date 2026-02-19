import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/proxy': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})

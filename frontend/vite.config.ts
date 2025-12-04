import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:1200', // Apuntar al nuevo puerto del backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})

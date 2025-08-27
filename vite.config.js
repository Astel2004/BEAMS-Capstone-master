import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expose to local network
    port: 4000,       // Frontend server port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server
        changeOrigin: true,             // Change the origin of the host header to the target URL
        secure: false,                  // Disable SSL verification for development
      },
    },
  },
})
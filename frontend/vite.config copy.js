// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // change if you use Vue or Svelte

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // allows ngrok/external access
    port: 5173,               // vite default
    allowedHosts: [
      'all',
      'bd740b630ac4.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io',
      '.localtunnel.me'
    ],    // allows any hostname and ngrok/localtunnel hosts
    cors: true,
    strictPort: false
  }
})

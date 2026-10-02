import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_ORIGIN ?? "http://localhost:5000",
        changeOrigin: true,
      },
      "/ws": {
        target: process.env.VITE_WS_ORIGIN ?? "http://localhost:3002",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      "@":path.resolve(__dirname,"./src")
    }
  }
})

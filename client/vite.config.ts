import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Listen on all local IPs
    strictPort: true,
    open: true,
    // HMR (Hot Module Replacement) mặc định bật
    // Nếu muốn cấu hình lại:
    // hmr: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
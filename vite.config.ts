import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base URL 설정
  // 로컬 개발: base는 '/'
  // Vercel: base는 '/' (process.env.VERCEL이 설정됨)
  // GitHub Pages: base는 '/youcandleit/' (repository 이름)
  base: process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? '/youcandleit/' : '/'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})

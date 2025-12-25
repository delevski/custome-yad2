import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/feed': {
        target: 'https://gw.yad2.co.il',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/feed/, '/realestate-feed'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
          'Referer': 'https://www.yad2.co.il/'
        }
      }
    }
  }
})

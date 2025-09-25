import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    watch: false,
    coverage: {
      exclude: [
        'node_modules/**',
        'src/setupTests.js',
        '**/*.config.js',
        '**/node_modules/@mui/**',
      ]
    }
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Ini penyelamatnya!

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Memanggil Tailwind agar desain aktif kembali
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    watch: {
      ignored: ['**/db.json'], // Mencegah kedip/refresh saat file db.json berubah
    },
  },
})
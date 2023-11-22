import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // à décommenter pour ide
  // server: {
  //     host: true,
  //     port: 9500
  // }
})

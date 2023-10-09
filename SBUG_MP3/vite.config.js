import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
    rollupOptions: {
      input: {
        main: 'src/main.js',
        cutter: 'mp3-cutter/src/cutter.js' // Make sure this path is correct
      },
    },
  },
  
  plugins: [react()],
})


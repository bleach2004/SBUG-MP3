import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
    rollupOptions: {
      input: {
        cutter: '/mp3-cutter/src/cutter.js',
        AudioEditor: '/src/components/AudioEditor.jsx',
        InputURL: '/src/components/InputURL.jsx',
        app: '/src/app.jsx',
        main: '/src/main.jsx',
      },
    },
  },

  plugins: [react()],
})


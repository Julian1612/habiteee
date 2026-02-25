import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // WICHTIG: Erlaubt das Hosten auf GitHub Pages in Unterverzeichnissen
  base: './', 
})
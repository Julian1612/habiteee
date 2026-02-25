import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Je nach deiner Installation

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/habiteee/', // WICHTIG: Hier exakt den Namen deines GitHub-Repos eintragen (z.B. /habit-tracker/)
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves a project repo from a sub-path, not the domain root, so
  // the built asset URLs have to carry the repo name. Change this to '/' if the
  // site ever moves to a custom domain or to a <user>.github.io repo.
  base: '/PersonalPortfolio/',
})

import { defineConfig } from 'vite'; // <--- THIS LINE IS THE FIX

export default defineConfig({
  base: './', 
  publicDir: 'public', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  }
});
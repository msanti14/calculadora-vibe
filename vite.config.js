import { defineConfig } from 'vite';

export default defineConfig({
  base: '/calculadora-vibe/',
  root: '.',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
  },
});
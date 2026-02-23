import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    assetsDir: 'assets',
  },
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['dist/**', '**/dist/**'],
  },
});

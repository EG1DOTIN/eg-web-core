import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

export default defineConfig({
  plugins: [react()],
  define: {
    __LIB_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'dist-site',
    emptyOutDir: true,
  },
});

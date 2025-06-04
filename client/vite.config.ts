import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  base: '/',
  optimizeDeps: {
    // Remove 'recharts' from exclude
    exclude: ['@mui/system', '@mui/icons-material', '@mui/material'],
    // Pre-bundle lodash modules used by recharts
    include: ['lodash/get', 'lodash/sortBy', 'lodash/isNil'],
    esbuildOptions: {
      preserveSymlinks: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    'global': {},
    'process.env': {},
  },
  plugins: [react()],
});

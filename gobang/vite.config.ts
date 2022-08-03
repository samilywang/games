import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
console.log(path.resolve(__dirname, 'node_modules/') + '/');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve('.', 'node_modules') + '/',
    },
  },
  plugins: [react()],
});

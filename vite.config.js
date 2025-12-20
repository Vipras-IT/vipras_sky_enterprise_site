import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // 5173 is default react port
    host: true,
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      context: path.resolve(__dirname, './src/context'),
      hooks: path.resolve(__dirname, './src/hooks'),
      assets: path.resolve(__dirname, './src/assets'),
      layouts: path.resolve(__dirname, './src/layouts'),
      api: path.resolve(__dirname, './src/api'),
      helpers: path.resolve(__dirname, './src/helpers'),
      config: path.resolve(__dirname, './src/config'),
      routes: path.resolve(__dirname, './src/routes'),
    },
  },
});

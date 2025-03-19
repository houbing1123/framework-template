import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginDynamicRoutes } from './plugins/VitePluginDynamicRoutes';

export default defineConfig({
  plugins: [react(), VitePluginDynamicRoutes()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
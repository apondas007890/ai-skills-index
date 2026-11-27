import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/ai-skills-index/' : '/'),
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'skills-data': ['./src/data/skills.json', './src/data/categories.json', './src/data/tags.json'],
        },
      },
    },
  },
});

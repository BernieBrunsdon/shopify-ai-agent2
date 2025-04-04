import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import environment from 'vite-plugin-environment';  // <-- Add this import

export default defineConfig({
  plugins: [
    // Add environment plugin first (before other plugins if needed)
    // Remove Supabase env variables from the plugin
environment([
  'VITE_SHOPIFY_STORE',
  'VITE_SHOPIFY_CLIENT_ID',
  'VITE_SHOPIFY_CLIENT_SECRET'
  // Removed Supabase vars
])
    
    // Your other plugins can follow
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
});
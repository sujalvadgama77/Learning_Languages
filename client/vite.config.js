import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),viteStaticCopy({
    targets: [
      {
        src: 'public/_redirects', // source
        dest: '.'                 // destination in dist/
      }
    ]
  })],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  define: {
    global: "globalThis",
  },
});

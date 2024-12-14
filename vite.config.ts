import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'


export default defineConfig({
  plugins: [
    dts({
      root: fileURLToPath(new URL('./src', import.meta.url)),
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    minify: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      fileName: 'index',
      formats: ['es', 'cjs', 'iife'],
      name: '_jlAuth',
    },
  },
})

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['zod', 'vite', 'unconfig', 'yup', 'joi'],
  target: 'node18',
  outDir: 'dist',
}); 
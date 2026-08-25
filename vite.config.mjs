import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { peerDependencies } from './package.json';

/**
 * Vite library build for `@onflow/onflow-shared-frontend`.
 *
 * Multi-entry: each public surface (root, common, core, features/...) emits
 * its own bundle so consumers can deep-import and benefit from tree-shaking.
 *
 * Anything listed in `peerDependencies` (or known transitive peer libs)
 * stays external — consumers must install them once at their app root.
 */

// ESM-equivalent of CommonJS `__dirname`. The package is `"type": "module"`
// and this file is .mjs, so Node's built-in `__dirname` global is unavailable.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const banner = `/**
 * @onflow/onflow-shared-frontend
 * Shared frontend primitives for Onflow OMS & Open Platform apps.
 * @see https://github.com/onflow/onflow-shared-frontend
 */`;

const PEER_DEPS = Object.keys(peerDependencies);

// Libs that are not declared as peer but our code may indirectly import.
// Keeping them external guarantees a single instance across consumers.
const IMPLICIT_EXTERNALS = [
  'i18next-browser-languagedetector',
  'lodash',
  'lodash/uniq',
  'flatpickr',
  'remixicon',
  'react-flatpickr',
  'tailwindcss',
];

const entries = {
  index: path.resolve(__dirname, 'src/index.ts'),
  common: path.resolve(__dirname, 'src/common/index.ts'),
  core: path.resolve(__dirname, 'src/core/index.ts'),
  'features/e-invoice': path.resolve(
    __dirname,
    'src/features/e-invoice/index.ts'
  ),
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.build.json',
      cleanVueFileName: false,
      insertTypesEntry: false,
    }),
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: entries,
      name: 'OnflowSharedFrontend',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [...PEER_DEPS, ...IMPLICIT_EXTERNALS],
      output: {
        banner,
        globals: {},
        // Preserve ESM/CJS module shape; do not interop helpers unnecessarily
        preserveModules: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  json: {
    parse: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});

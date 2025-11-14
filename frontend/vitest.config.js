import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    deps: {
      optimizer: {
        web: {
          include: [],
        },
      },
      registerNodeLoader: true,
    },
    server: {
      deps: {
        inline: [/@mui/],
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
});

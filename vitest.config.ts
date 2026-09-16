import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['verifier/tests/unit/**/*.test.ts'],
    environment: 'node'
  }
});

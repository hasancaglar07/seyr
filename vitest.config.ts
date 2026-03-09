import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@seyir/contracts": "./packages/contracts/src/index.ts",
    },
  },
});
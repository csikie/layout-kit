import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

// Next.js owns `dev` and `build`. This file configures the Vite+ toolchain:
// formatting, linting, staged hooks, tests, and cacheable tasks.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["public/r/**", ".next/**", "out/**", ".wrangler/**", "next-env.d.ts"],
  },
  lint: {
    ignorePatterns: ["public/r/**", ".next/**", "out/**", ".wrangler/**", "next-env.d.ts"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  run: {
    cache: true,
    tasks: {
      // Side effects, never cached: serve out/ locally, or upload it to Cloudflare.
      preview: { command: "wrangler dev", cache: false },
      deploy: { command: "wrangler deploy", cache: false },
      "registry:build": {
        command: "vpx ./scripts/build-registry.ts",
        cache: {
          env: ["NEXT_PUBLIC_SITE_URL", "NODE_ENV"],
          input: [{ auto: true }, "!public/r/**", "!node_modules/.cache/**"],
          output: ["public/r/**"],
        },
      },
      build: {
        command: "next build",
        dependsOn: ["registry:build"],
        cache: {
          env: ["NEXT_PUBLIC_SITE_URL", "NODE_ENV"],
          input: [{ auto: true }, "!.next/**", "!out/**", "!next-env.d.ts", "!*.tsbuildinfo"],
          output: [".next/**", "!.next/cache/**", "out/**"],
        },
      },
    },
  },
});

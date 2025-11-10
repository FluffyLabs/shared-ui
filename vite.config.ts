/// <reference types="vitest/config" />
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { glob } from "glob";

import { peerDependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["lib/**/*.ts", "lib/**/*.tsx"],
      exclude: [
        "lib/**/*.test.ts",
        "lib/**/*.test.tsx",
        "lib/**/*.stories.ts",
        "lib/**/*.stories.tsx",
        "lib/test/**/*",
      ],
      outDir: "dist",
      insertTypesEntry: true,
      rollupTypes: false, // Don't bundle types - keep them separate for better tree-shaking
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: glob
        .sync("lib/**/*.{ts,tsx}", {
          ignore: ["lib/**/*.test.{ts,tsx}", "lib/**/*.stories.{ts,tsx}", "lib/test/**/*"],
        })
        .reduce((entries, file) => {
          const key = file.replace(/^lib\//, "").replace(/\.(ts|tsx)$/, "");
          entries[key] = resolve(__dirname, file);
          return entries;
        }, {}),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Exclude peer dependencies from the bundle to reduce bundle size
      external: [
        // React - ensure all React imports are external
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^react($|\/)/, // Catches all react imports including subpaths
        ...Object.keys(peerDependencies),
        // Also externalize all @radix-ui packages and other deps
        /^@radix-ui\//,
        "clsx",
        "class-variance-authority",
        "tailwind-merge", // Explicitly external
        "lucide-react",
        "tw-animate-css",
      ],
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "lib",
          entryFileNames: "[name].es.js",
          assetFileNames: "styles.css",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "lib",
          entryFileNames: "[name].cjs.js",
          exports: "named",
          assetFileNames: "styles.css",
        },
      ],
    },
    cssCodeSplit: false,
    cssMinify: false,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./lib/test/setup.ts",
    coverage: {
      all: false,
      enabled: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
    },
  },
});

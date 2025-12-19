import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts", // Bundle registers one or more manifests
      formats: ["es"],
      fileName: "unused-media",
    },
    outDir: "../wwwroot/App_Plugins/UnusedMedia", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
      output: {
        inlineDynamicImports: true,
      },
    },
  }
});

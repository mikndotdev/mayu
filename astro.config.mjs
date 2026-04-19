// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [pagefind(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});

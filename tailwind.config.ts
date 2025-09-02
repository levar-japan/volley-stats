import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;

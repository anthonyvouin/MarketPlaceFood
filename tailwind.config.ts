import type { Config } from "tailwindcss";
import {red} from "next/dist/lib/picocolors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        light:"#F7EFE9",
        redColor: "#d51c1c",
        primaryColor:'#E0475B'

      },
    },
  },
  plugins: [],
};
export default config;

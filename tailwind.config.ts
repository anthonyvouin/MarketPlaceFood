import type { Config } from "tailwindcss";

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
        primaryColor:'#F54747',

        actionColor:'#85BC39',
        darkActionColor:'#294819',
        primaryBackgroundColor: '#EBF2F0',
        info: '#d7af44',
        star:'#F6C778',
        grey: '#b6b7b4',
        borderGrey: '#858280',
        tertiaryColorPink: '#FBB6B2',
        tertiaryColorOrange: '#F6C778',
        tertiaryColorBlue: '#61D4EC',
        tertiaryColorPurple: '#9682DA',
      },
      backgroundColor: {
        tertiaryColorPink: '#FBB6B2',
        tertiaryColorOrange: '#F6C778',
        tertiaryColorBlue: '#61D4EC',
        tertiaryColorPurple: '#9682DA',
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

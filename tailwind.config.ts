import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)', opacity: '0.8' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        light: "#F7EFE9",
        redColor: "#d51c1c",
        primaryColor: '#F54747',

        actionColor: '#85BC39',
        darkActionColor: '#294819',
        primaryBackgroundColor: '#EBF2F0',
        info: '#d7af44',
        star: '#F6C778',
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

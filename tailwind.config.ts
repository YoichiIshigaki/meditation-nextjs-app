import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      meditation: "var(--m-plus-1code)",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        sea: "url('/images/bg-sea.jpg')",
        "conic-gradient":
          "conic-gradient(#556cb7 0%, #4c59a4 40%, #fff 40%, #fff 60%, #2c237e 60%, #372379 100%);",
      },
      animation: {
        pointer: "rotate 7500ms linear forwards infinite",
        grow: "grow 3s linear forwards",
        shrink: "shrink 3s linear forwards",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        grow: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.2)" },
        },
        shrink: {
          "0%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        shortPing: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "80%": { transform: "scale(1.6)", opacity: "0.15" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        starSpin: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "30%": { transform: "rotate(20deg) scale(1.15)" },
          "60%": { transform: "rotate(-15deg) scale(1.1)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },
      },
      animation: {
        shortPing: "shortPing 0.6s ease-out forwards",
        starSpin: "starSpin 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

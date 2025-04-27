
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        background: "#1A1F2C",
        "neon-purple": "#9d00ff",
        "neon-green": "#39ff14",
        "neon-pink": "#ff00ff",
        "dark-surface": "#1a1a1a",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch": "glitch 1s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "33%": { transform: "translate(-5px, 2px)" },
          "66%": { transform: "translate(5px, -2px)" },
        }
      },
      boxShadow: {
        'glow': '0 0 15px 5px currentColor',
        'neon': '0 0 5px theme("colors.neon-purple"), 0 0 20px theme("colors.neon-purple")',
      },
      scale: {
        '103': '1.03',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

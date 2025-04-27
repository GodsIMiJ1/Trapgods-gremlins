
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        background: "#000000",
        "dark-background": "#0a0a23",
        "neon-green": "#39ff14",
        "neon-pink": "#ff00ff",
        "neon-purple": "#9d00ff",
        "cyber-blue": "#00ffff",
        "dark-surface": "#1a1a1a",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        glitch: ['"VT323"', 'monospace'],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch": "glitch 1s ease-in-out infinite",
        "flicker": "flicker 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "33%": { transform: "translate(-5px, 2px)" },
          "66%": { transform: "translate(5px, -2px)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "0.99" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
      boxShadow: {
        'glow': '0 0 15px 5px currentColor',
        'neon': '0 0 5px theme("colors.neon-green"), 0 0 20px theme("colors.neon-purple")',
        'neon-green': '0 0 5px theme("colors.neon-green"), 0 0 15px theme("colors.neon-green")',
        'neon-pink': '0 0 5px theme("colors.neon-pink"), 0 0 15px theme("colors.neon-pink")',
        'neon-purple': '0 0 5px theme("colors.neon-purple"), 0 0 15px theme("colors.neon-purple")',
        'cyber-blue': '0 0 5px theme("colors.cyber-blue"), 0 0 15px theme("colors.cyber-blue")',
      },
      scale: {
        '103': '1.03',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

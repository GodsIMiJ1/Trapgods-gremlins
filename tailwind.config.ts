import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        background: "#1A1F2C",
        "neon-purple": "#9b87f5",
        "neon-green": "#F2FCE2",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        'glow': '0 0 15px 5px currentColor',
      },
      scale: {
        '103': '1.03',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

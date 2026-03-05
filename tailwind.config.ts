import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'IBM Plex Sans'", "sans-serif"],
      },
      colors: {
        rx: {
          bg:       "#080808",
          surface:  "#0f0f0f",
          border:   "#1c1c1c",
          text:     "#ede8dc",
          muted:    "#9a9488",
          amber:    "#f59e0b",
          amber2:   "#fbbf24",
          green:    "#22c55e",
          red:      "#ef4444",
        },
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulse2: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease-out forwards",
        shimmer: "shimmer 1.4s infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

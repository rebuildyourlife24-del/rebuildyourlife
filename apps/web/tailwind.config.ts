import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#000000", // Intense pure black
        navyLight: "#000000", // Pure black
        gold: "#00f0ff", // Bright ice cyan for accents
        goldLight: "#bdfcff", // Pale ice
        surface: "rgba(255, 255, 255, 0.05)", // Ice glass
        surfaceLight: "rgba(255, 255, 255, 0.1)", // Lighter ice glass
        textPrimary: "#ffffff", // Pure bright white
        textSecondary: "#a8c5d6", // Icy light blue-grey
        success: "#00ffcc", // Bright neon mint
        warning: "#ffd500", // Bright star yellow
        danger: "#ff3366" // Bright crimson
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00f0ff55 0deg, #030014 180deg, #00f0ff55 360deg)',
      },
      animation: {
        'aurora': 'aurora 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'stars-move': 'stars 100s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(2%, 2%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        stars: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

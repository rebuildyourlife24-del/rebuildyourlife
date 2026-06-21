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
        navy: "#000000", // Vantablack
        navyLight: "#050505", // Deep Obsidian
        gold: "#ffffff", // Pure white for text
        goldLight: "#cccccc", // Muted white
        surface: "rgba(10, 10, 10, 0.8)", // Dark terminal glass
        surfaceLight: "rgba(20, 20, 20, 0.9)", // Lighter terminal glass
        textPrimary: "#ffffff", // Pure white
        textSecondary: "#666666", // Stealth grey
        success: "#00ff33", // Terminal/Matrix Green
        warning: "#ffaa00", // System yellow
        danger: "#ff003c" // DARPA Red
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #ff003c22 0deg, #000000 180deg, #ff003c22 360deg)',
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

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
        navy: "#0a192f", // Marineblauw (diep blauw)
        navyLight: "#112240", // Lichter marineblauw
        gold: "#d4af37", // Goud voor accenten
        goldLight: "#f3e5ab", // Lichter goud
        surface: "rgba(10, 25, 47, 0.8)", // Marineblauw glass
        surfaceLight: "rgba(17, 34, 64, 0.9)", // Lichter marineblauw glass
        textPrimary: "#ffffff", // Wit voor contrast
        textSecondary: "#8892b0", // Lichtblauw/grijs
        success: "#10b981", // Emerald green
        warning: "#f59e0b", // Amber
        danger: "#ef4444" // Rood
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #0a192f22 0deg, #112240 180deg, #0a192f22 360deg)',
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

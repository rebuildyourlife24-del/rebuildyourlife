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
        background: "#020202",
        surface: "rgba(10, 10, 15, 0.7)",
        surfaceLight: "rgba(20, 20, 25, 0.8)",
        neonCyan: "#06b6d4",
        neonCyanDim: "rgba(6, 182, 212, 0.2)",
        neonBlue: "#3b82f6",
        neonBlueDim: "rgba(59, 130, 246, 0.2)",
        neonPurple: "#8b5cf6",
        neonPurpleDim: "rgba(139, 92, 246, 0.2)",
        textPrimary: "#ffffff",
        textSecondary: "#9ca3af",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #06b6d422 0deg, #3b82f622 180deg, #06b6d422 360deg)',
      },
      animation: {
        'aurora': 'aurora 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
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
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.5)' },
        },
        gridScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.jsx",
    "./components/**/*.jsx",
    "./app/**/*.jsx",
    "./src/**/*.jsx",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // NexMart Dark Theme Palette
        neon: {
          green: "#00e676",
          "green-dim": "#00c853",
          "green-glow": "rgba(0, 230, 118, 0.15)",
          teal: "#00acc1",
        },
        dark: {
          bg: "#080d14",
          card: "#0d1523",
          "card-hover": "#111c2e",
          border: "#1a2a40",
          "border-bright": "#1e3a52",
        },
        primary: {
          DEFAULT: "#00e676",
          foreground: "#080d14",
          dark: "#00c853",
          dim: "rgba(0, 230, 118, 0.12)",
        },
        secondary: {
          DEFAULT: "#00acc1",
          foreground: "#ffffff",
          dark: "#0097a7",
        },
        success: { DEFAULT: "#00e676", dark: "#00c853" },
        warning: { DEFAULT: "#ffab40", dark: "#ff8f00" },
        danger: { DEFAULT: "#ff5252", dark: "#c62828" },
        info: { DEFAULT: "#40c4ff", dark: "#0091ea" },
        sidebar: {
          DEFAULT: "#0d1523",
          foreground: "#e2e8f0",
          dark: "#080d14",
        },
        card: {
          DEFAULT: "#0d1523",
          foreground: "#e2e8f0",
          dark: "#080d14",
        },
        background: {
          DEFAULT: "#080d14",
          dark: "#04080e",
        },
        input: {
          DEFAULT: "#1a2a40",
          dark: "#1a2a40",
        },
        border: {
          DEFAULT: "#1a2a40",
          dark: "#1e3a52",
        },
        muted: {
          DEFAULT: "#557a9a",
          foreground: "#8bafc7",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      spacing: { 128: "32rem", 144: "36rem" },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00e676 0%, #00acc1 100%)",
        "dark-gradient": "linear-gradient(135deg, #0d1523 0%, #080d14 100%)",
        "card-gradient": "linear-gradient(145deg, #0d1523, #111c2e)",
        "hero-gradient": "linear-gradient(135deg, #080d14 0%, #0d1523 50%, #080d14 100%)",
        "shimmer": "linear-gradient(90deg, transparent, rgba(0,230,118,0.05), transparent)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 230, 118, 0.3), 0 0 40px rgba(0, 230, 118, 0.1)",
        "neon-sm": "0 0 10px rgba(0, 230, 118, 0.2)",
        "neon-lg": "0 0 40px rgba(0, 230, 118, 0.25), 0 0 80px rgba(0, 230, 118, 0.1)",
        dark: "0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)",
        "dark-lg": "0 20px 60px rgba(0, 0, 0, 0.6)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 230, 118, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0, 230, 118, 0)" },
        },
        "glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7, filter: "brightness(1.3)" },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease forwards",
        "pulse-neon": "pulse-neon 2s infinite",
        "glow": "glow 2s ease-in-out infinite",
        "slide-in": "slide-in 0.4s ease forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
};

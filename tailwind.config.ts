import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Warm, nurse-friendly palette
        primary: {
          DEFAULT: "#8B9FE8", // Soft lavender blue
          foreground: "#FFFFFF",
          50: "#F5F7FF",
          100: "#E8ECFF",
          200: "#D1DAFF",
          300: "#A8B8FF",
          400: "#8B9FE8",
          500: "#6B7FD7",
          600: "#5A6BC7",
          700: "#4A5AB7",
          800: "#3A4A97",
          900: "#2A3A77",
        },
        secondary: {
          DEFAULT: "#E8F4F8", // Soft mint
          foreground: "#2A5A6B",
          50: "#F0F9FC",
          100: "#E8F4F8",
          200: "#D1E9F1",
          300: "#A8D4E3",
          400: "#7FBFD5",
          500: "#56AAC7",
          600: "#4A95B9",
          700: "#3E80AB",
          800: "#326B9D",
          900: "#26568F",
        },
        accent: {
          DEFAULT: "#F8E8F4", // Soft pink
          foreground: "#6B2A5A",
          50: "#FCF0F9",
          100: "#F8E8F4",
          200: "#F1D1E9",
          300: "#E3A8D4",
          400: "#D57FBF",
          500: "#C756AA",
          600: "#B94A95",
          700: "#AB3E80",
          800: "#9D326B",
          900: "#8F2656",
        },
        // Status colors - softer versions
        success: {
          DEFAULT: "#A8E6CF", // Soft mint green
          foreground: "#2A5A3E",
        },
        warning: {
          DEFAULT: "#FFD3A5", // Soft peach
          foreground: "#8B4513",
        },
        destructive: {
          DEFAULT: "#FFB3BA", // Soft coral (only for critical)
          foreground: "#8B0000",
        },
        // Mood indicators
        calm: "#A8E6CF",
        anxious: "#FFD3A5",
        pain: "#FFB3BA",
        // Priority ribbons
        critical: "#FF8A95",
        high: "#FFB366",
        stable: "#90EE90",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem", // Extra rounded for warmth
        "2xl": "2rem",
        "3xl": "3rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 1s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        warm: "0 4px 20px -2px rgba(139, 159, 232, 0.15)",
        gentle: "0 1px 3px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

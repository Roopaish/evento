import { type Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      gridTemplateColumns: {
        "30": "repeat(25, minmax(0, 30px))",
        "10g": "repeat(10, minmax(0, 50px))",
        "20g": "repeat(20, minmax(0, 50px))",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          lg: "2.5rem",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "rgb(254, 248, 250)",
          100: "rgb(252, 231, 239)",
          200: "rgb(250, 212, 227)",
          300: "rgb(248, 191, 213)",
          400: "rgb(244, 162, 194)",
          500: "rgb(234, 76, 137)",
          600: "rgb(228, 74, 133)",
          700: "rgb(187, 61, 110)",
          800: "rgb(155, 50, 91)",
          900: "rgb(111, 36, 65)",
          950: "rgb(69, 22, 40)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      },

      boxShadow: {
        container:
          "0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
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
        drawAndEraseLine: {
          "0%": {
            strokeDasharray: "0, 2000",
            strokeDashoffset: "0",
          },
          "50%": {
            strokeDasharray: "2000, 2000",
            strokeDashoffset: "-1000",
          },
          "100%": {
            strokeDasharray: "0, 2000",
            strokeDashoffset: "-2000",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "line-draw-and-erase": "drawAndEraseLine 4s infinite",
      },
    },
    backgroundImage: {
      bar: "linear-gradient(66deg, #e6fbfe 0%, #edddfb 100%)",
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

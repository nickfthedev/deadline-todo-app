import { type Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "base-100": "var(--color-base-100)",
        "base-200": "var(--color-base-200)",
        "base-300": "var(--color-base-300)",
        "neutral-100": "var(--color-neutral-100)",
        "neutral-200": "var(--color-neutral-200)",
        "neutral-300": "var(--color-neutral-300)",

        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",

        warning: "var(--color-warning)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        info: "var(--color-info)",
      },
      animation: {
        draw: "draw 2s linear normal",
      },
    },
    keyframes: {
      draw: {
        to: { strokeDashoffset: "200" },
      },
    },
    fontFamily: {
      sans: [
        '"InterVariable"',
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ["ui-serif", "Georgia"],
      mono: [
        '"JetBrains Mono"',
        "monospace",
        "ui-monospace",
        "Menlo",
        "Monaco",
        '"Cascadia Mono"',
        '"Segoe UI Mono"',
        '"Roboto Mono"',
        '"Oxygen Mono"',
        '"Ubuntu Monospace"',
        '"Source Code Pro"',
        '"Fira Mono"',
        '"Droid Sans Mono"',
        '"Courier New"',
      ],
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
} satisfies Config;
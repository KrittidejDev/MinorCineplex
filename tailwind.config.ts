import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#FF0000",
          r548: "#E54548",
          r009: "#FF0009",
        },

        yellow: {
          DEFAULT: "#FFFF00",
          orange: "#FFCC00",
        },
        orange: {
          DEFAULT: "#FF6600",
        },
        purple: {
          DEFAULT: "#8A2BE2",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Poppins", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        headline: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-1": ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],
        "headline-2": ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
        "headline-3": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "headline-4": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "body-1": ["1rem", { lineHeight: "1.5rem" }],
        "body-2": ["0.875rem", { lineHeight: "1.25rem" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;

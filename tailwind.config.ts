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
        gray: {
          gc1b: "#070C1B",
          g63f: "#21263F",
          gf7e: "#565F7E",
          g3b0: "#8B93B0",
          gedd: "#C8CEDD",
        },

        white: {
          wfff: "#FFFFFF",
        },

        blue: {
          bbee: "#4E7BEE",
          b9a8: "#1E29A8",
          b580: "#0C1580",
          b525: "#101525",
        },

        green: {
          g372: "#00A372",
        },

        red: {
          r64b: "#E5364B",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
        headline: ["Roboto", "sans-serif"],
        body: ["Roboto", "sans-serif"],
      },
      fontSize: {
        // Headline styles
        "f-56": ["3.5rem", { lineHeight: "4rem", fontWeight: "700" }], // 56px/64px
        "f-36": ["2.25rem", { lineHeight: "2.75rem", fontWeight: "700" }], // 36px/44px
        "f-24": ["1.5rem", { lineHeight: "1.875rem", fontWeight: "700" }], // 24px/30px
        "f-20": ["1.25rem", { lineHeight: "1.625rem", fontWeight: "700" }], // 20px/26px

        // Body styles
        "fm-16": ["1rem", { lineHeight: "1.5rem", fontWeight: "500" }], // 16px/24px Medium
        "fr-16": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 16px/24px Regular
        "fm-14": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }], // 14px/20px Medium
        "fr-14": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], // 14px/20px Regular
        "fm-12": ["0.75rem",{ lineHeight: "1.125rem", fontWeight: "500" },], // 12px/18px Medium
        "fr-12": ["0.75rem",{ lineHeight: "1.125rem", fontWeight: "400" },], // 12px/18px Regular
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

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
        base: {
          gray0: '#070C1B',
          gray100: '#21263F',
          gray200: '#565F7E',
          gray300: '#8B93B0',
          gray400: '#C8CEDD',
          white: '#FFFFFF',
        },
        brand: {
          blue100: '#4E7BEE',
          blue200: '#1E29A8',
          blue300: '#0C1580',
          green: '#00A372',
          red: '#E5364B',
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
        "headline-1": ["3.5rem", { lineHeight: "4rem", fontWeight: "700" }], // 56px/64px
        "headline-2": ["2.25rem", { lineHeight: "2.75rem", fontWeight: "700" }], // 36px/44px
        "headline-3": ["1.5rem", { lineHeight: "1.875rem", fontWeight: "700" }], // 24px/30px
        "headline-4": ["1.25rem", { lineHeight: "1.625rem", fontWeight: "700" }], // 20px/26px
        
        // Body styles
        "body-1-medium": ["1rem", { lineHeight: "1.5rem", fontWeight: "500" }], // 16px/24px Medium
        "body-1-regular": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 16px/24px Regular
        "body-2-medium": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }], // 14px/20px Medium
        "body-2-regular": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], // 14px/20px Regular
        "body-3-medium": ["0.75rem", { lineHeight: "1.125rem", fontWeight: "500" }], // 12px/18px Medium
        "body-3-regular": ["0.75rem", { lineHeight: "1.125rem", fontWeight: "400" }], // 12px/18px Regular
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

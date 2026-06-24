import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "#d7dde8",
        surface: "#f6f8fb",
        ink: "#172033",
        muted: "#657289",
        brand: "#0f766e"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: "#0B1E33",
        asphalt2: "#122A45",
        paper: "#F5F3EE",
        signal: "#F2A93B",
        slate: "#5B6B7C",
        profit: "#3F8F5F",
        deficit: "#C4573B",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "route-line":
          "repeating-linear-gradient(90deg, #F2A93B 0px, #F2A93B 14px, transparent 14px, transparent 26px)",
      },
    },
  },
  plugins: [],
};
export default config;

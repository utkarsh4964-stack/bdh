import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0B0D",
        surface: "#131417",
        surface2: "#1B1D22",
        border: "#24262C",
        ink: "#EDEFF2",
        muted: "#8B909C",
        teal: "#5EEAD4",
        violet: "#7C6FFF",
        amber: "#F5A623",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        pulseBar: {
          "0%, 100%": { transform: "scaleY(0.3)", opacity: "0.5" },
          "50%": { transform: "scaleY(1)", opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        pulseBar: "pulseBar 1.4s ease-in-out infinite",
        drift: "drift 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

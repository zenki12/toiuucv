/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        gold: { DEFAULT: "#C9A96E", light: "#E8C98A", dark: "#8B6635" },
        ink: {
          DEFAULT: "#0A0A0A",
          2: "#111111",
          3: "#1A1A1A",
          4: "#242424",
          5: "#2E2E2E",
        },
        cream: { DEFAULT: "#E8E0D5", muted: "rgba(232,224,213,0.5)", faint: "rgba(232,224,213,0.2)" },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

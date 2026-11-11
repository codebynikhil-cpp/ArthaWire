/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fin: {
          bg: "#090D14",
          secondary: "#0E1420",
          elevated: "#141C29",
          card: "#111927",
          hover: "#192436",
          surface: "#1B2637",
          border: "rgba(148, 163, 184, 0.12)",
          borderDefault: "rgba(148, 163, 184, 0.20)",
          text: "#F1F5F9",
          secondaryText: "#A0AEC0",
          muted: "#64748B",
          positive: "#22C55E",
          negative: "#EF4444",
          neutral: "#94A3B8",
          warning: "#F59E0B",
          info: "#38BDF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        terminal: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

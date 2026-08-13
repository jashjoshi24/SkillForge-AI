/**
 * Skill Cartography design tokens — Section 9 of the project docs.
 * Keep this file the single source of truth for color/type tokens; never
 * hardcode raw hex values in components.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#10243E",
        "bg-surface": "#16324F",
        "text-primary": "#EDEDE3",
        "text-muted": "#A9B4C0",
        "accent-brass": "#C89B3C",
        "accent-sage": "#6B9080",
        "accent-rust": "#B5563C",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        card: "6px",
        pill: "999px",
      },
      spacing: {
        unit: "8px",
      },
    },
  },
  plugins: [],
};

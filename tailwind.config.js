export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html", // Good, this ensures your hero.html/main.html are scanned
  ],
  theme: {
    extend: {
      colors: {
        // 1. Map 'brand-primary' to your main brand color variable
        brand: {
          primary: withOpacity("--brand-500"), 
          100: withOpacity("--brand-100"),
          500: withOpacity("--brand-500"),
          700: withOpacity("--brand-700"),
        },
        // 2. Add the 'highlight' key used for Nova Scotia/Carpool text
        highlight: withOpacity("--brand-700"), // Or a specific --highlight var if you have one
        
        ui: {
          bg: withOpacity("--bg-main"),
          surface: withOpacity("--bg-surface"),
          border: withOpacity("--border-main"),
          primary: withOpacity("--primary"),
          text: withOpacity("--text-main"),
          muted: withOpacity("--text-muted"),
        }
      },
      // 3. Optional: Add custom animations if you want the fade-in to work out of the box
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}

function withOpacity(variableName) {
  return `color-mix(in srgb, var(${variableName}), transparent calc(100% - <alpha-value> * 100%))`;
}
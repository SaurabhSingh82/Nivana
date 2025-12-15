// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}"
  ],
  theme: {
    extend: {
      borderColor: {
        // defines utility class "border-border" which uses your CSS variable
        border: 'hsl(var(--border))',
      },
      // agar tum chaho to colors/others bhi extend kar sakte ho
    },
  },
  plugins: [],
}

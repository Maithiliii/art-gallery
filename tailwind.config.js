// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      keyframes: {
        floaty: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.4" },
          "50%": { transform: "translateY(-20px) scale(1.2)", opacity: "0.8" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.4" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.8s ease-out",
        fadeInLeft: "fadeInLeft 0.8s ease-out",
        fadeInRight: "fadeInRight 0.8s ease-out",
        scaleIn: "scaleIn 0.8s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

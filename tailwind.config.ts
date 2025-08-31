import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",     // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",   // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
       colors: {
        brandRed: "#cf2f23", // tweak to match your red
      },
       borderRadius: {
        card: "22px",
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      fontSize: {
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '4rem': '4rem',
        '6rem': '6rem',
        '8rem': '8rem',
        '10rem': '10rem',
        '12rem': '12rem',
      },
      lineHeight: {
        '2.2rem': '2.2rem',
        '2.7rem': '2.7rem',
        '3.5rem': '3.5rem',
        '5.2rem': '5.2rem',
        '7rem': '7rem',
        '8.5rem': '8.5rem',
        '10.5rem': '10.5rem',
      },
     
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require("tw-animate-css"), // optional if you use animate.css
  ],
};

export default config;

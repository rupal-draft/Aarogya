/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#e6f7ff',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },
        health: {
          50: '#e6f6f2',
          100: '#cceee6',
          200: '#99dccd',
          300: '#66cbb3',
          400: '#33b999',
          500: '#00a880', // 👈 This is used by `from-health-500`
          600: '#008666',
          700: '#00644d',
          800: '#004333',
          900: '#00211a',
        },
        danger: {
          50: '#ffeaea',
          100: '#ffcbcb',
          200: '#ff9d9d',
          300: '#ff6e6e',
          400: '#ff4040',
          500: '#ff1111', // 👈 used in from-danger-500
          600: '#cc0e0e',
          700: '#990a0a',
          800: '#660707',
          900: '#330303',
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
      },
      boxShadow: {
        "inner-lg": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      border: "#e5e7eb",
    },
  },
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
  //       "gradient-conic":
  //         "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  //     },
  //     fontFamily: {
  //       montserrat: ["Montserrat", "sans-serif"],
  //       lato: ["Lato", "sans-serif"],
  //       ubuntu: ["Ubuntu", "sans-serif"],
  //       open_sans: ["Open Sans", "sans-serif"],
  //       playfair: ["Playfair Display", "serif"],
  //     },
  //     animation: {
  //       "spin-slow": "spin 3s linear infinite",
  //       "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  //       "bounce-slow": "bounce 3s infinite",
  //       float: "float 3s ease-in-out infinite",
  //       "fade-in": "fadeIn 0.6s ease-out forwards",
  //       wiggle: "wiggle 1s ease-in-out infinite",
  //     },
  //     transitionProperty: {
  //       height: "height",
  //       spacing: "margin, padding",
  //     },
  //     keyframes: {
  //       wiggle: {
  //         "0%, 100%": { transform: "rotate(-3deg)" },
  //         "50%": { transform: "rotate(3deg)" },
  //       },
  //       fadeIn: {
  //         "0%": { opacity: "0", transform: "translateY(10px)" },
  //         "100%": { opacity: "1", transform: "translateY(0)" },
  //       },
  //     },
  //     colors: {
  //       border: "hsl(var(--border))",
  //       input: "hsl(var(--input))",
  //       ring: "hsl(var(--ring))",
  //       background: "hsl(var(--background))",
  //       foreground: "hsl(var(--foreground))",
  //       primary: {
  //         DEFAULT: "hsl(var(--primary))",
  //         foreground: "hsl(var(--primary-foreground))",
  //       },
  //       secondary: {
  //         DEFAULT: "hsl(var(--secondary))",
  //         foreground: "hsl(var(--secondary-foreground))",
  //       },
  //       destructive: {
  //         DEFAULT: "hsl(var(--destructive))",
  //         foreground: "hsl(var(--destructive-foreground))",
  //       },
  //       muted: {
  //         DEFAULT: "hsl(var(--muted))",
  //         foreground: "hsl(var(--muted-foreground))",
  //       },
  //       accent: {
  //         DEFAULT: "hsl(var(--accent))",
  //         foreground: "hsl(var(--accent-foreground))",
  //       },
  //       popover: {
  //         DEFAULT: "hsl(var(--popover))",
  //         foreground: "hsl(var(--popover-foreground))",
  //       },
  //       card: {
  //         DEFAULT: "hsl(var(--card))",
  //         foreground: "hsl(var(--card-foreground))",
  //       },
  //     },
  //     borderRadius: {
  //       lg: "var(--radius)",
  //       md: "calc(var(--radius) - 2px)",
  //       sm: "calc(var(--radius) - 4px)",
  //     },
  //   },
  // },
  plugins: [require("tailwindcss-animate")],
};

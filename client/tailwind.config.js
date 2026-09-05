/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F9FC',
          100: '#EAF4FA',
          200: '#BFD9E8',
          300: '#8FBAD6',
          400: '#5C9AC4',
          500: '#2E6FA0',
          600: '#2E6FA0', // Primary Brand Color #2E6FA0
          700: '#235780', // Darker Hover Blue #235780
          800: '#1E4E73',
          900: '#153954',
          DEFAULT: '#2E6FA0',
        },
        brand: {
          50: '#F4F9FC',
          100: '#EAF4FA',
          200: '#BFD9E8',
          300: '#8FBAD6',
          400: '#5C9AC4',
          500: '#2E6FA0',
          600: '#2E6FA0',
          700: '#235780',
          800: '#1E4E73',
          900: '#153954',
          DEFAULT: '#2E6FA0',
        },
        emerald: {
          50: '#F4F9FC',
          100: '#EAF4FA',
          200: '#BFD9E8',
          300: '#8FBAD6',
          400: '#5C9AC4',
          500: '#2E6FA0',
          600: '#2E6FA0',
          700: '#235780',
          800: '#1E4E73',
          900: '#153954',
          DEFAULT: '#2E6FA0',
        },
        teal: {
          50: '#F4F9FC',
          100: '#EAF4FA',
          200: '#BFD9E8',
          300: '#8FBAD6',
          400: '#5C9AC4',
          500: '#2E6FA0',
          600: '#2E6FA0',
          700: '#235780',
          800: '#1E4E73',
          900: '#153954',
          DEFAULT: '#2E6FA0',
        }
      }
    },
  },
  plugins: [],
}

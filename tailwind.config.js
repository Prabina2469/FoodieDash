/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material 3 Brand & Functional Tokens
        primary: {
          DEFAULT: '#b51c00',
          bright: '#ff4d2d',
          container: '#db3416',
          fixed: '#ffdad3',
          'fixed-dim': '#ffb4a5',
          'on-container': '#fffbff',
        },
        secondary: {
          DEFAULT: '#006d37',
          bright: '#27ae60',
          container: '#7bf8a1',
          fixed: '#7efba4',
          'fixed-dim': '#61de8a',
          'on-container': '#007239',
        },
        tertiary: {
          DEFAULT: '#795600',
          bright: '#ffb800',
          container: '#986d00',
          fixed: '#ffdea8',
          'fixed-dim': '#ffba20',
          'on-container': '#fffbff',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        // Surfaces & Background
        background: '#f9f9fc',
        surface: {
          DEFAULT: '#f9f9fc',
          dim: '#dadadc',
          bright: '#f9f9fc',
          'container-lowest': '#ffffff',
          'container-low': '#f3f3f6',
          container: '#eeeef0',
          'container-high': '#e8e8ea',
          'container-highest': '#e2e2e5',
          tint: '#ba1d00',
        },
        'on-surface': '#1a1c1e',
        'on-surface-variant': '#5c403a',
        'on-background': '#1a1c1e',
        outline: {
          DEFAULT: '#906f69',
          variant: '#e5beb6',
        },
        'inverse-surface': '#2f3133',
        'inverse-on-surface': '#f0f0f3',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        headline: ['Montserrat', 'sans-serif'],
        editorial: ['Noto Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Public Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem', // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem', // 12px
        'lg': '1rem', // 16px
        'xl': '1.5rem', // 24px
        '2xl': '2rem', // 32px
        'full': '9999px',
      },
      boxShadow: {
        'level-1': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'level-2': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'level-3': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'glow-primary': '0 0 25px rgba(255, 77, 45, 0.25)',
        'glow-secondary': '0 0 25px rgba(39, 174, 96, 0.2)',
      },
    },
  },
  plugins: [],
};

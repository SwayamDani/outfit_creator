/** @type {import('tailwindcss').Config} */
module.exports = {
    // Define where Tailwind should look for classes
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        // Custom colors for your fashion app
        colors: {
          primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        },
        // Custom animation for loading states
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
        // Custom spacing for layout
        spacing: {
          '112': '28rem',
          '128': '32rem',
        }
      },
    },
    plugins: [],
  }
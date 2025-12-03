/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fondo: '#F1F8E9',
        verde: {
          principal: '#4CAF50',
          secundario: '#81C784'
        },
        texto: {
          oscuro: '#2E7D32'
        }
      },
      borderRadius: {
        card: '12px'
      }
    }
  },
  plugins: []
}

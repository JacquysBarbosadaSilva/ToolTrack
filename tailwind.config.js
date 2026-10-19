/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sidebar (Figma)
        sidebar: {
          DEFAULT: '#111B2E',
          hover: 'rgba(255, 255, 255, 0.05)',
          active: 'rgba(255, 255, 255, 0.08)',
          border: '#1E293B',
        },
        // Fundo do conteúdo / Canvas
        canvas: {
          bg: '#FAF7F7',
          card: '#FFFFFF',
        },
        // Botão Primário Azul Forte (Figma)
        brand: {
          primary: '#0B4FB3',
          'primary-hover': '#093F8F',
          'primary-active': '#073275',
        },
        // Bordas de destaque dos Cards de KPI
        kpi: {
          blue: '#0B4FB3',
          red: '#DC2626',
          green: '#16A34A',
          dark: '#334155',
        },
        // Paleta de Azuis dos Gráficos (do mais escuro ao mais claro)
        chart: {
          1: '#1E2A4A',
          2: '#2F4A85',
          3: '#4A6DB5',
          4: '#8A9BCB',
          5: '#B8C4E3',
        },
        // Badges de Status
        status: {
          normal: {
            bg: '#F0FDF4',
            border: '#BBF7D0',
            text: '#15803D',
          },
          low: {
            bg: '#FEFCE8',
            border: '#FEF08A',
            text: '#A16207',
          },
          critical: {
            bg: '#FEF2F2',
            border: '#FECACA',
            text: '#B91C1C',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '0.75rem', // 12px (rounded-xl)
        btn: '0.375rem',  // 6px (rounded-md)
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

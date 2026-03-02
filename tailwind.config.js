/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair', 'Georgia', 'serif']
      },

      // ─── Palette nommée — classes Tailwind directes ────────────────────
      // Exemples : bg-gold, text-gold-light, border-emerald, bg-canvas
      colors: {
        gold: {
          DEFAULT: '#E79412',
          light:   '#F5EDE3',
          dark:    '#B97208'
        },
        emerald: {
          DEFAULT: '#059669',
          light:   '#E6F4F0',
          dark:    '#047857'
        },
        danger: {
          DEFAULT: '#DE3434',
          light:   '#FDEAEA',
          dark:    '#B91C1C'
        },
        muted:  '#64748B',
        navy:   '#0F172A',
        canvas: '#F2F5F9'
      },

      boxShadow: {
        'gold-sm': '0 1px 3px 0 rgb(231 148 18 / 0.20)',
        'gold-md': '0 4px 12px 0 rgb(231 148 18 / 0.25)'
      }
    }
  },

  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      // ─── THÈME CLAIR ────────────────────────────────────────────────────
      {
        btcapital: {
          // Couleur marque
          primary:           '#E79412',  // or / amber
          'primary-content': '#1A0A00',  // texte foncé sur fond or

          secondary:           '#059669', // vert émeraude
          'secondary-content': '#ffffff',

          accent:           '#F5EDE3',   // beige chaud (surfaces, highlights)
          'accent-content': '#7C4A00',

          neutral:           '#64748B',  // gris ardoise
          'neutral-content': '#ffffff',

          // Fonds
          'base-100': '#F2F5F9',   // fond principal (canvas)
          'base-200': '#e7ecf21a',   // fond cartes / sidebar
          'base-300': '#D0D8E6',   // bordures, séparateurs
          'base-content': '#0F172A', // texte principal (navy)

          // États sémantiques
          info:           '#3B82F6',
          'info-content': '#ffffff',

          success:           '#059669',
          'success-content': '#ffffff',

          warning:           '#E79412',
          'warning-content': '#1A0A00',

          error:           '#DE3434',
          'error-content': '#ffffff'
        }
      },

      // ─── THÈME SOMBRE ───────────────────────────────────────────────────
      {
        'btcapital-dark': {
          // La marque garde sa couleur or
          primary:           '#E79412',
          'primary-content': '#1A0A00',

          secondary:           '#059669',
          'secondary-content': '#ffffff',

          accent:           '#7C4A00',   // beige → ocre sombre en dark
          'accent-content': '#F5EDE3',

          neutral:           '#334155',
          'neutral-content': '#F1F5F9',

          // Fonds inversés
          'base-100': '#0F172A',   // fond principal (navy profond)
          'base-200': '#1E293B',   // fond secondaire (cartes)
          'base-300': '#334155',   // bordures / dividers
          'base-content': '#F1F5F9', // texte clair

          // États sémantiques (légèrement plus clairs pour lisibilité dark)
          info:           '#60A5FA',
          'info-content': '#0F172A',

          success:           '#34D399',
          'success-content': '#022C22',

          warning:           '#FBBF24',
          'warning-content': '#1A0A00',

          error:           '#F87171',
          'error-content': '#1A0000'
        }
      }
    ],

    defaultTheme: 'btcapital',
    darkTheme:    'btcapital-dark',
    base:    true,
    styled:  true,
    utils:   true,
    logs:    false
  }
};

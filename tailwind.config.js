/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Centralised retro-pixel design tokens. Existing components keep their
      // arbitrary-value classes (`font-['Press_Start_2P']`, `bg-[#0d0d14]`)
      // because Tailwind treats those as valid alongside these named tokens —
      // new code (and any future refactor) should prefer the names below.
      fontFamily: {
        // Heading font — chunky 8-bit pixel typeface used for nearly every
        // label and title in the UI.
        pixel: ['"Press Start 2P"', 'monospace'],
        // Body font — readable retro monospace for paragraphs / longer copy.
        'pixel-mono': ['VT323', 'monospace'],
      },
      colors: {
        // Surface tokens. `page` is the deepest background, `card` is the
        // panel surface, `subtle` is the inner inset / nested-block colour.
        page: '#0a0a0f',
        card: '#0d0d14',
        subtle: '#12121a',
        // Border tokens. `default` is the resting card border, `muted` is
        // the divider colour for in-card separators.
        border: {
          DEFAULT: '#1e1e2e',
          muted: '#27272a',
        },
        // Foreground tokens, mirrored from the Tailwind zinc palette so the
        // visual weight stays consistent. Keep the names semantic: `default`
        // is body text, `muted` is metadata, `faint` is disabled / hint.
        ink: {
          default: '#e4e4e7',
          muted: '#a1a1aa',
          faint: '#71717a',
          disabled: '#52525b',
        },
        // Accent palette — single source of truth for the green glow used as
        // the brand identity throughout the app. `accent` is the resting
        // colour, `accent-hover` is the hover state, `accent-deep` is the
        // shadow / pressed state.
        accent: {
          DEFAULT: '#22c55e',
          hover: '#4ade80',
          deep: '#15803d',
        },
      },
      boxShadow: {
        // Recurring glow patterns used by hero cards and primary CTAs. The
        // `pixel-frame` is the inset offset shadow that gives panels their
        // chunky "screen edge" look.
        'pixel-glow-sm': '0 0 12px rgba(34,197,94,0.35)',
        'pixel-glow': '0 0 18px rgba(34,197,94,0.45)',
        'pixel-glow-lg': '0 0 60px rgba(34,197,94,0.35)',
        'pixel-frame':
          '0 0 0 4px rgba(10,10,15,0.8), 0 0 60px rgba(34,197,94,0.35)',
      },
    },
  },
  plugins: [],
};

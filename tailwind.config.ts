
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Update to use CSS variables from next/font
        body: ['var(--font-lato)', 'sans-serif'],
        headline: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        // HSCM Brand Colors from PRD
        'hscm-green': '#166534', // primary
        'hscm-red': '#B91C1C',   // accent (maps to destructive)
        'hscm-gold': '#FBBF24',  // highlight (maps to secondary/accent)
        'dark-text': '#1C1917',
        'body-text': '#333333',
        'background-light': '#FFFFFF',
        'background-dark': '#1a1a1a', // for footer

        // HSCM Brand Colors (available as Tailwind utilities e.g., bg-hscm-green)
        // These were existing, some might be redundant now or map to the above
        // 'hscm-red': 'var(--hscm-red)', // #D90429 - This was an older red, PRD specifies #B91C1C
        // 'hscm-gold': 'var(--hscm-gold)', // #FFD700 - PRD specifices #FBBF24
        // 'hscm-green': 'var(--hscm-green)', // #00A86B - PRD specifices #166534
        'hscm-green-dark-theme': 'var(--hscm-green-dark-theme)', // #00B37F
        'hscm-gold-dark-theme': 'var(--hscm-gold-dark-theme)', // #FFDE33
        'body-text-light': 'var(--body-text-light)',
        'body-text-dark': 'var(--body-text-dark)',

        // ShadCN theme variables (for consistency with existing components & theme structure)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

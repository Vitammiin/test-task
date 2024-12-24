import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customBlack: {
          100: '#27272A',
        },
        customBlue: {
          100: '#0070F3',
          200: '#006FEE',
        },
        customPink: {
          100: '#FF6AFD',
        },
        customGrey: {
          100: '#ECEDEE',
          200: '#D4D4D8',
          300: '#71717A',
        },
        mainPrimaryText: '#FFFFFF',
        mainBackground: '#121212',
        secondaryBackground: '#171717',
        white: '#FFFFFF',
        current: 'currentColor',
        transparent: 'transparent',
        success: '#17C964',
        failure: '#F31260',
      },
      fontFamily: {
        'Inter-400': ['Inter-400', 'sans-serif'],
        'Inter-500': ['Inter-500', 'sans-serif'],
        'Inter-600': ['Inter-600', 'sans-serif'],
        'Inter-700': ['Inter-700', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '1.25'],
        sm: ['14px', '1.4'],
        // base: ['16px', '1.5'],
        // lg: ['18px', '1.5'],
        xl: ['20px', '1.4'],
        // '2xl': ['24px', '1.3'],
        // '4xl': ['36px', '0.9'],
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '-1px',
        xl: '1440px',
        '2xl': '-1px',
      },

      borderRadius: {
        sm: '10px',
        md: '11px',
        lg: '12px',
        xl: '24px',
      },
    },
  },
} satisfies Config;

import type {Config} from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            fontFamily: {
                sans: ['Heebo', 'IBM Plex Sans', ...defaultTheme.fontFamily.sans]
            },
            fontSize: {
                // 'ci-13': ['0.8125rem', {lineHeight: 'normal'}],
                // 'ci-13-15': ['0.8125rem', {lineHeight: '0.9375rem'}],
                // 'ci-15': ['0.9375rem', {lineHeight: 'normal'}],
                // 'ci-15-16': ['0.9375rem', {lineHeight: '1rem'}],
            },
            flexBasis: {
              // '1/7': '14.2857143%',
              // '1/8': '12.5%',
            },
            keyframes: {
                infiniteloading: {
                    '0%': {left: '-100%'},
                    '100%': {left: '100%'},
                },
            },
            animation: {
                infiniteloading: 'infiniteloading 3s linear infinite',
            },
            colors: {
                // 'ci-light-green': '#7CE23C',
                 'dark-gray': '#323232',
                // 'ci-dark-gray-50': '#32323280',
                // 'ci-white': '#FFFFFF',
                // 'ci-yellow': {
                //   50: '#FFB70E',
                //   100: '#FFB70E',
                //   200: '#FFB70E',
                //   300: '#FFDE14', //do not change
                //   400: '#FFB70E',
                //   500: '#FFB70E', //do not change
                //   600: '#FFB70E',
                //   700: '#FF9900', //do not change
                //   800: '#FFB70E',
                //   900: '#FFB70E',
                //   950: '#FFB70E',
                // },
                // 'ci-orange': '#FF6902',
                // 'ci-turquoise': '#0FC6DB',
                // 'ci-red': {
                //   700: '#D72A1D'
                // },
            },
            boxShadow: {
                // 'ci-1px': '0 1px 1px 0 rgba(50, 50, 50, 0.04)',
                // 'ci-2px': '0px 0px 2px 0px #68DE1F',
                // 'ci-2px-slider-thumb': '0px 0px 2px 0px rgba(50, 50, 50, 0.2)',
                // 'ci-16px': '0 4px 16px 0 rgba(0, 0, 0, 0.20)',
                // 'ci-24px': '0px 4px 24px 0px #FF94584D'
            }
        }
    },
    content: [
        `components/**/*.{vue,js}`,
        `layouts/**/*.vue`,
        `pages/**/*.vue`,
        `composables/**/*.{js,ts}`,
        `plugins/**/*.{js,ts}`,
        `app.{js,ts,vue}`
    ]
}

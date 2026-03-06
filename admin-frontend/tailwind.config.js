/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f1f8f4',
                    100: '#def0e4',
                    200: '#bee0cd',
                    300: '#8ec7ab',
                    400: '#58a782',
                    500: '#358a65',
                    600: '#266d4f',
                    700: '#205741',
                    800: '#1b4635',
                    900: '#163a2d',
                    950: '#0c2019',
                },
                surface: {
                    50: '#fdfbf7',
                    100: '#e8e4d9',
                    800: '#1a211d',
                    850: '#131815',
                    900: '#0e1210',
                    950: '#080a09',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

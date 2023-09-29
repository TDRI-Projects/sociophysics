/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                'lovelo-black': ['Lovelo Black']
            },
            colors: {
                tdri: {
                    main: '#7ab6db',
                    light: '#c0d9e9',
                    grey: '#818385'
                }
            }
        },
    },
    plugins: [],
}


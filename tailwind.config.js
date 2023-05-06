/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
        colorScheme: {
            dark: {
                bg_1: "#202124",
                bg_2: "#35363A",
                bg_3: "#4C4D50",
                bg_4: "#646568",
                bg_5: "#97989C",
                fg_1: "#B1B2B6",
                fg_2: "#CDCED2",
                fg_3: "#DEE1E6",
                fg_4: "#E9EAEE",
                fg_5: "#FFFFFF",
            }
        }
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                "transparent": "transparent",
                "dark-theme-1": "#000000",
                "dark-theme-2": "#202124",
                "dark-theme-3": "#35363A",
                "dark-theme-4": "#4C4D50",
                "dark-theme-5": "#646568",
                "dark-theme-6": "#97989C",
                "dark-theme-7": "#B1B2B6",
                "dark-theme-8": "#CDCED2",
                "dark-theme-9": "#DEE1E6",
                "dark-theme-9": "#E9EAEE",
                "dark-theme-10": "#FFFFFF",
            },
            width: {
                "content": "max-content"
            },
            animation: {
                "tooltip-fade-in": "tooltip-fade-in 0.2s 1 both"
            },
            keyframes: {
                "tooltip-fade-in": {
                    "0%": { opacity: "0", transform: "translate(0px) translateY(-50%)" },
                    "100%": { opacity: "1", transform: "translate(-4px) translateY(-50%)" }
                }
            },
            dropShadow: {
                "tooltip": "1px 2px 4px #101010"
            }
        },
    },
    plugins:  [require("tailwind-scrollbar-hide")], // 스크롤바 숨기기 플러그인
}
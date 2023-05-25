/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            screens: {
                "txl": { "max": "1280px" },
                "tlg": { "max": "1024px" },
                "tmd": { "max": "768px" },
                "tsm": { "max": "640px" },
            },
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
                "blue-theme-bg": "#17181B",
                "blue-theme-border": "#8AB4F8",
                "blur-theme": "#202124CC",
            },
            width: {
                "content": "max-content"
            },
            animation: {
                "fade-in": "fade-in 0.2s 1 both",
                "fontbox-fade-in": "fontbox-fade-in 0.4s 1 both",
                "tooltip-fade-in": "tooltip-fade-in 0.2s 1 both"
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateX(-50%) translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateX(-50%) translateY(0)" }
                },
                "fontbox-fade-in": {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                "tooltip-fade-in": {
                    "0%": { opacity: "0", transform: "translate(0px) translateY(-50%)" },
                    "100%": { opacity: "1", transform: "translate(-4px) translateY(-50%)" }
                }
            },
            dropShadow: {
                "default": "1px 2px 4px #101010",
                "none": "0 0 0 transparent"
            }
        },
    },
    plugins:  [require("tailwind-scrollbar-hide")], // 스크롤바 숨기기 플러그인
}
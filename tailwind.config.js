/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: "class",
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
                "theme-1": "#000000",
                "theme-2": "#202124",
                "theme-3": "#35363A",
                "theme-4": "#4C4D50",
                "theme-5": "#646568",
                "theme-6": "#97989C",
                "theme-7": "#B1B2B6",
                "theme-8": "#CDCED2",
                "theme-9": "#E9EAEE",
                "theme-10": "#FFFFFF",
                "theme-blue-1": "#8AB4F8",
                "theme-blue-2": "#17181B",
                "theme-yellow": "#FCBE11",
                "theme-red": "#EF4444"
            },
            width: {
                "content": "max-content"
            },
            animation: {
                "zoom-in": "zoom-in 0.2s 1 both",
                "fontbox-zoom-in": "fontbox-zoom-in 0.2s 1 both",
                "fade-in": "fade-in 0.2s 1 both",
                "account-fade-in": "fontbox-fade-in 0.2s 1 both",
                "fontbox-fade-in": "fontbox-fade-in 0.4s 1 both",
                "tooltip-fade-in": "tooltip-fade-in 0.2s 1 both"
            },
            keyframes: {
                "zoom-in": {
                    "0%": { opacity: "0", transform: "scale(0.5)" },
                    "100%": { opacity: "1", transform: "scale(1)" }
                },
                "fontbox-zoom-in": {
                    "0%": { opacity: "0", transform: "translateX(-50%) scale(0.5)" },
                    "100%": { opacity: "1", transform: "translateX(-50%) scale(1)" }
                },
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
                },
            },
            dropShadow: {
                "default": "1px 2px 4px #97989C",
                "dark": "1px 2px 4px #101010",
                "none": "0 0 0 transparent"
            }
        },
    },
    plugins:  [require("tailwind-scrollbar-hide")], // 스크롤바 숨기기 플러그인
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: "class",
    theme: {
        fontFamily: {
            'sans': ['Spoqa Han Sans Neo', 'sans-serif']
        },
        extend: {
            screens: {
                "txl": { "max": "1280px" },
                "tlg": { "max": "1024px" },
                "tmd": { "max": "768px" },
                "tsm": { "max": "640px" },
                "txs": { "max": "480px" },
            },
            colors: {
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
                "theme-red": "#FF084A",
                "theme-green": "#40E0D0",
                "theme-naver": "#03C75A",
                "theme-kakao": "#FFE812",
                h: {
                    "0": "#006AE2",
                    "1": "#1B73E7",
                    "e": "#E9F0FE",
                    "f": "#F9FAFD",
                    "r": "#F03A39",
                    "r-h": "#FF5252",
                },
                l: {
                    "2": "#202124",
                    "5": "#5F6368",
                    "b": "#BDC1C6",
                    "d": "#D2D4DC",
                    "e": "#E9EAEE",
                },
                f: {
                    "1": "#17181B",
                    "8": "#8AB4F8",
                    "9": "#9FBCF2",
                },
                d: {
                    "2": "#202124",
                    "3": "#2D2E31",
                    "4": "#3C4043",
                    "6": "#646568",
                    "9": "#97989C",
                    "c": "#CDCED2",
                }
            },
            animation: {
                "zoom-in": "zoom-in 0.2s 1 both",
                "zoom-in-fontbox": "zoom-in-fontbox 0.2s 1 both",
                "fade-in": "fade-in 0.2s 1 both",
                "fade-in-fontbox": "fade-in-fontbox 0.4s 1 both",
                "fade-in-from-top": "fade-in-from-top 0.2s 1 both",
                "fade-in-account": "fade-in-fontbox 0.2s 1 both",
                "skeleton-anim": "skeleton-anim 2s infinite"
            },
            backgroundImage: {
                "gradient": "linear-gradient(90deg, #E9F0FE, #F9FAFD, #E9F0FE)",
                "gradient-dark": "linear-gradient(90deg, #35363A, #4C4D50, #35363A)"
            },
            backgroundSize: {
                "gradient-size": "200% 100%"
            },
            keyframes: {
                "zoom-in": {
                    "0%": { opacity: "0", transform: "scale(0.5)" },
                    "100%": { opacity: "1", transform: "scale(1)" }
                },
                "zoom-in-fontbox": {
                    "0%": { opacity: "0", transform: "translateX(-50%) scale(0.5)" },
                    "100%": { opacity: "1", transform: "translateX(-50%) scale(1)" }
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateX(-50%) translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateX(-50%) translateY(0)" }
                },
                "fade-in-fontbox": {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                "fade-in-from-top": {
                    "0%": { opacity: "0", transform: "translateY(-12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                "skeleton-anim": {
                    "0%": { backgroundPosition: "200% center" },
                    "100%": { backgroundPosition: "0% center" }
                }
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
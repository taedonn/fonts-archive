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
                "tlg": { "max": "1024px" },
                "tmd": { "max": "768px" },
                "tsm": { "max": "640px" },
                "txs": { "max": "480px" },
            },
            colors: {
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
                    "9": "#97989C",
                    "b": "#BDC1C6",
                    "d": "#D2D4DC",
                    "e": "#E9EAEE",
                    "f": "#F2F1F6"
                },
                f: {
                    "1": "#17181B",
                    "8": "#8AB4F8",
                    "9": "#9FBCF2",
                },
                d: {
                    "2": "#202124",
                    "3": "#323639",
                    "4": "#404240",
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
                "fade-in-time-out": "fade-in-time-out 1s 1 both",
                "skeleton-anim": "skeleton-anim 2s infinite",
                "pulse": "pulse 3s linear infinite",
            },
            backgroundImage: {
                "gradient": "linear-gradient(90deg, #F9FAFD, #D4E1FD, #F9FAFD)",
                "gradient-dark": "linear-gradient(90deg, #323639, #646568, #323639)"
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
                "fade-in-time-out": {
                    "0%": { opacity: "1" },
                    "90%": { opacity: "1" },
                    "100%": { opacity: "0" }
                },
                "skeleton-anim": {
                    "0%": { backgroundPosition: "200% center" },
                    "100%": { backgroundPosition: "0% center" }
                },
                "pulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(240, 58, 57, 0.7),  0 0 0 0 rgba(240, 58, 57, 0.7)" },
                    "40%": { boxShadow: "0 0 0 0.1875rem rgba(240, 58, 57, 0.0),  0 0 0 0 rgba(240, 58, 57, 0.7)" },
                    "80%": { boxShadow: "0 0 0 0.1875rem rgba(240, 58, 57, 0.0),  0 0 0 0.1125rem rgba(240, 58, 57, 0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(240, 58, 57, 0.0),  0 0 0 0.1125rem rgba(240, 58, 57, 0)" },
                }
            },
            dropShadow: {
                "default": "1px 2px 4px #97989C",
                "dark": "1px 2px 4px #101010",
                "none": "0 0 0 transparent"
            }
        },
    },
}
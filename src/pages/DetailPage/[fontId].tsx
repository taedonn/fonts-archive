// Next hooks
import Link from "next/link";
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useCookies } from 'react-cookie';

// hooks
import { isMacOs } from "react-device-detect";
import { throttle } from "lodash";

// api
import { FetchView } from "../api/fetchview";
import { FetchFontInfo } from "../api/DetailPage/fetchFontInfo";

// materail-ui hooks
import { Slider } from "@mui/material";

// components
import Tooltip from "@/components/tooltip";
import FontSearch from "@/components/fontsearch";
import DummyText from "@/components/dummytext";

function DetailPage({params}: any) {

    // 쿠키 훅
    const [cookies, setCookie] = useCookies<string>([]);

    // 폰트 데이터 props
    const font = params.fonts[0];

    // 폰트 미리보기 props
    const defaultFontSize = params.initFontSize;
    const defaultLineHeight = params.initLineHeight;
    const defaultLetterSpacing = params.initLetterSpacing;

    /** 조회수 업데이트 */
    const viewUpdate = async () => {
        await fetch("/api/updateview", { method: "POST", body: JSON.stringify(font) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { viewUpdate(); }, [font]);

    /** 조회수 불러오기 */
    const defaultView = font.view;
    const [view, setView] = useState<number>(defaultView);

    /** 조회수 불러오기 클라이언트 사이드 */
    // const viewFetch = async () => {
    //     const res = await axios.get("/api/fetchview", { params: { code: font.code } }).then(res => { return res.data; }).catch(error => console.log(error));
    //     setView(res.fonts[0].view);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useLayoutEffect(() => { viewFetch(); }, [view]);

    /** 조회수 단위 변경 : 1000 => 1K */
    const ranges = [
        { divider: 1e6 , suffix: 'M' },
        { divider: 1e3 , suffix: 'k' }
    ];
    const formatNumber = (n: number | null) => {
        if (n === null) {
            return ""
        }
        else {
            for (let i = 0; i < ranges.length; i++) {
                if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
            }
        }
        return n.toString();
    }

    /** 폰트 검색 훅 */
    const defaultSearchDisplay = "hide"
    const [searchDisplay, setSearchDisplay] = useState(defaultSearchDisplay);
    useEffect(() => { setSearchDisplay(defaultSearchDisplay); }, [defaultSearchDisplay])

    /** 폰트 검색 버튼 클릭 */
    const handleFontSearch = () => {
        setSearchDisplay("show");
        document.body.style.overflow = "hidden";
    }

    /** 폰트 검색 ESC 버튼 클릭 */
    const handleFontSearchCloseBtn = () => {
        setSearchDisplay("hide");
        document.body.style.overflow = "auto";
    }

    /** 키값 변경 */
    const [isMac, setIsMac] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (isMacOs) { setIsMac(true) }
        else { setIsMac(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMacOs]);

    /** 웹 폰트 적용하기 훅 */
    const defaultWebFont = "CSS";
    const [webFont, setWebFont] = useState(defaultWebFont);
    useEffect(() => {
        setWebFont(defaultWebFont);
    },[defaultWebFont]);

    /** 웹 폰트 클릭 시 코드 변경 */
    const handleWebFont = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "CSS") { setWebFont("CSS"); }
        else if (e.target.value === "link") { setWebFont("link"); }
        else if (e.target.value === "import") { setWebFont("import"); }
        else { setWebFont("font-face"); }
    }

    useEffect(() => {
        const cdnFontFace = document.getElementById("cdn-font-face") as HTMLDivElement;
        if (webFont === "font-face") { cdnFontFace.innerHTML = font.cdn_font_face; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webFont]);

    /** 웹 폰트 적용하기 복사 버튼 클릭 이벤트 */
    const copyOnClick = () => {
        const pre = document.getElementsByClassName("cdn_pre")[0] as HTMLPreElement;
        const copyBtn = document.getElementsByClassName("copy_btn")[0] as SVGSVGElement;
        const copyChkBtn = document.getElementsByClassName("copy_chk_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(pre.innerText);

        copyBtn.style.display = 'none';
        copyChkBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'block';
            copyChkBtn.style.display = 'none';
        },1000);
    }

    /** 폰트 미리보기 텍스트 체인지 이벤트 */
    const defaultText = "";
    const [text, setText] = useState(defaultText);
    useEffect(() => {
        setText(defaultText);
    }, [defaultText])
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    /** 라이센스 본문 */
    useEffect(() => {
        const license = document.getElementById("license") as HTMLDivElement;
        license.innerHTML = font.license;
    }, [font.license]);

    /** lodash/throttle을 이용해 스크롤 제어 */
    const handleScroll = () => {
        const inputTheme = document.getElementById("color-theme") as HTMLInputElement;
        inputTheme.checked = false;
    }
    const throttledScroll = throttle(handleScroll,500);

    /** lodash/throttle을 이용해 스크롤 */
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    /** 컬러 테마 ref */
    const refThemeLabel = useRef<HTMLLabelElement>(null);
    const refThemeDiv = useRef<HTMLDivElement>(null);

    /** 컬러 테마 영역 외 클릭 */
    useEffect(() => {
        function handleThemeOutside(e:Event) {
            const themeInput = document.getElementById("color-theme") as HTMLInputElement;
            if (refThemeDiv?.current && !refThemeDiv.current.contains(e.target as Node) && refThemeLabel.current && !refThemeLabel.current.contains(e.target as Node)) {
                themeInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleThemeOutside);
        return () => document.removeEventListener("mouseup", handleThemeOutside);
    },[refThemeDiv, refThemeLabel]);

    /** 컬러 테마 선택창 팝업 */
    const handleColorTheme = (e:React.ChangeEvent<HTMLInputElement>) => {
        const colorTheme = document.getElementById("color-theme-select") as HTMLDivElement;
        if (e.target.checked) {
            colorTheme.classList.add("animate-fade-in");
            setTimeout(function() { colorTheme.classList.remove('animate-fade-in'); },600);
        }
    }

    /** 컬러 테마 state */
    const defaultTheme = "dark";
    const [theme, setTheme] = useState(defaultTheme);
    useLayoutEffect(() => {
        const lightMode = document.getElementById("light-mode") as HTMLInputElement;
        const darkMode = document.getElementById("dark-mode") as HTMLInputElement;

        if (cookies.theme === undefined || cookies.theme === "dark") {
            document.documentElement.classList.add('dark');
            darkMode.checked = true;
            setTheme("dark");
        } else {
            document.documentElement.classList.remove('dark');
            setTheme("light");
            lightMode.checked = true;
        }
    }, [cookies.theme]);

    /** 컬러 테마 변경 */
    const handleColorThemeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const themeInput = document.getElementById("color-theme") as HTMLInputElement;

        if (e.target.checked) {
            setCookie('theme', e.target.value, {path:'/', secure:true, sameSite:'none'});
            if (e.target.value === "dark") {
                document.documentElement.classList.add('dark');
                setTheme("dark");
            } else {
                document.documentElement.classList.remove('dark');
                setTheme("light");
            }
        }
        themeInput.checked = false;
    }

    // 폰트 미리보기 state
    const [fontSize, setFontSize] = useState<number>(defaultFontSize);
    const [lineHeight, setLineHeight] = useState<number>(defaultLineHeight);
    const [letterSpacing, setLetterSpacing] = useState<number>(defaultLetterSpacing);

    /** MUI TextArea 줄바꿈 시 높이 변경 */
    const handleHeightChange = (e: any) => {
        e.target.style.height = 0;
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    /** MUI 폰트 크기 뒤에 px 추가 */
    const fnAddUnit = (value: number) => { return value + "px"; }

    /** MUI 행간 값 */
    const fnLineheightValue = (value: number) => { return value / 10; }

    /** MUI 자간 값 */
    const fnLetterSpacingValue = (value: number) => { return value / 10; }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={font.name + " · 폰트 아카이브"}
                description={font.name + " - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 헤더 */}
            <div className='interface w-[100%] h-[60px] tlg:h-[56px] px-[20px] tlg:px-[16px] tmd:px-[12px] fixed right-0 top-0 z-20 flex flex-row justify-between items-center backdrop-blur bg-theme-9/80 dark:bg-theme-2/80 border-b border-theme-7 dark:border-theme-4'>
                <div className="flex flex-row justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" aria-label="logo" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-theme-4 dark:bg-theme-1/80 hover:dark:bg-theme-1/60 tlg:hover:dark:bg-theme-1/80 hover:drop-shadow-default tlg:hover:drop-shadow-none hover:dark:drop-shadow-dark tlg:hover:dark:drop-shadow-none">
                        <svg className="w-[18px] tlg:w-[16px] pb-px fill-theme-10 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </a>
                </div>
                <div className="w-content flex flex-row justify-start items-center">
                    <button onClick={handleFontSearch} className="w-[220px] tlg:w-[200px] tmd:w-[32px] h-[32px] relative text-[14px] tlg:text-[12px] text-normal text-theme-5 dark:text-theme-8 leading-none bg-theme-8 dark:bg-theme-3/80 flex flex-start justify-start items-center rounded-[8px] tmd:rounded-[6px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:bg-theme-8 hover:bg-theme-7/60 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none">
                        <span className="tmd:hidden">폰트 검색하기...</span>
                        <svg className="w-[12px] tlg:w-[10px] absolute left-[16px] tlg:left-[11px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                        <div className="absolute right-[16px] flex flex-row justify-center items-center">
                            {
                                isMac === true
                                ? <div className="flex flex-row justify-center items-center">
                                    <svg className="tmd:hidden w-[10px] fill-theme-3 dark:fill-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                    <span className="tmd:hidden text-[12px] leading-none pt-px">K</span>
                                </div>
                                : ( isMac === false
                                    ? <span className="tmd:hidden text-[12px] tlg:text-[10px] leading-none">Ctrl + K</span>
                                    : <></>
                                )
                            }
                        </div>
                    </button>
                    <div className='w-px h-[20px] tlg:h-[16px] tmd:hidden rounded-full mx-[10px] mr-[8px] tlg:mx-[8px] tlg:mr-[4px] bg-theme-7 dark:bg-theme-4'></div>
                    <div className="relative mx-[10px] txl:mx-[8px]">
                        <input onChange={handleColorTheme} type="checkbox" id="color-theme" className="hidden"/>
                        <label ref={refThemeLabel} htmlFor="color-theme" className="w-[32px] h-[32px] flex flex-row justify-center items-center cursor-pointer">
                            <svg className={`light-mode light-label w-[20px]`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                            <svg className={`dark-mode dark-label w-[20px]`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg>
                        </label>
                        <div ref={refThemeDiv} id="color-theme-select" className="color-theme-select w-[128px] absolute left-[50%] top-[40px] translate-x-[-50%] rounded-[8px] px-[16px] py-[8px] bg-theme-5 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark">
                            <input onChange={handleColorThemeChange} type="radio" name="color-theme-select" id="light-mode" value="light" className="hidden"/>
                            <label htmlFor="light-mode" className="flex flex-row justify-start items-center py-[8px] cursor-pointer">
                                <svg className={`light-svg w-[16px] fill-theme-9/80"`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                                <span className={`light-txt text-[14px] ml-[10px]`}>라이트 모드</span>
                            </label>
                            <input onChange={handleColorThemeChange} type="radio" name="color-theme-select" id="dark-mode" value="dark" className="hidden"/>
                            <label htmlFor="dark-mode" className="flex flex-row justify-start items-center py-[8px] cursor-pointer">
                                <svg className={`dark-svg w-[16px] fill-theme-9/80`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg>
                                <span className={`dark-txt text-[14px] ml-[10px]`}>다크 모드</span>
                            </label>
                        </div>
                    </div>
                    <Link aria-label="github-link" href="https://github.com/taedonn/fonts-archive" target="_blank" className="w-[32px] h-[32px] flex flex-row justify-center items-center">
                        <svg className="w-[22px] fill-theme-4/80 hover:fill-theme-4 tlg:hover:fill-theme-4/80 dark:fill-theme-9/80 hover:dark:fill-theme-9 tlg:hover:dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                    </Link>
                </div>
            </div>

            {/* 메인 */}
            <div className="w-[100%] mt-[60px] tlg:mt-[56px] p-[20px] tlg:p-[16px] tmd:p-[12px] py-[24px] tlg:py-[20px] tmd:py-[16px]">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-[100%] flex flex-col justify-start items-start">
                    <div style={{fontFamily:font.font_family}} className="text-[32px] tlg:text-[28px] tmd:text-[24px] text-theme-3 dark:text-theme-9 font-medium leading-tight mb-[12px] tlg:mb-[8px]">{font.name}</div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 ml-[2px] mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">
                            제작
                            <Link href={{pathname: "/", query: {search: font.source}}} className="relative group text-theme-yellow dark:text-theme-blue-1 border-b border-theme-yellow dark:border-theme-blue-1 ml-[8px] tlg:ml-[6px]">
                                {font.source}
                                <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[13px] font-medium leading-none px-[14px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fade-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">제작사의 다른 폰트 보기</div>
                            </Link>
                        </div>
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9  mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">형태<span className="text-theme-5 dark:text-theme-7 ml-[8px] tlg:ml-[6px]">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : (font.font_type === "Display" ? "장식체" : "픽셀체")))}</span></div>
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 ">조회수<span className="text-theme-5 dark:text-theme-7 ml-[8px] tlg:ml-[6px]">{formatNumber(view)}</span></div>
                    </div>
                    <div className="w-[100%] h-px my-[20px] tlg:my-[16px] bg-theme-7 dark:bg-theme-4"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <Link aria-label="source-link" href={font.source_link} target="_blank" className="h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-blue-1 font-medium dark:border-2 tmd:dark:border dark:border-theme-blue-1 rounded-full px-[20px] mr-[12px] tmd:mr-[8px] cursor-pointer bg-theme-yellow hover:bg-theme-yellow/90 tlg:hover:bg-theme-yellow dark:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent">다운로드 페이지로 이동</Link>
                    {
                        font.license_ofl === "N"
                        ? <></>
                        : <Link aria-label="github-source-link" href={font.github_link} target="_blank" className="w-[180px] tlg:w-[140px] tmd:w-[128px] h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9 dark:text-theme-9 font-medium dark:border-2 tmd:dark:border border-theme-4 dark:border-theme-9 rounded-full px-[20px] cursor-pointer bg-theme-4 hover:bg-theme-4/90 tlg:hover:bg-theme-4 dark:bg-transparent hover:dark:bg-theme-9/10 tlg:hover:dark:bg-transparent">폰트 다운로드</Link>
                    }
                </div>
                {
                    font.license_embed === "N" || font.license_ofl === "N"
                    ? <></>
                    : <>
                        <div className="flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                            <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">웹 폰트 사용하기</h2>
                            <div className="cdn w-[1000px] tlg:w-[100%] h-[60px] tlg:h-[48px] tmd:h-[40px] overflow-hidden border-x border-t border-b border-theme-4 dark:border-theme-3/80 rounded-t-[8px] flex flex-row justify-start items-center">
                                <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                                <label htmlFor="cdn_css" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 focused:text-theme-9 dark:text-theme-9 leading-none cursor-pointer">CSS 설정하기</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                                <label htmlFor="cdn_link" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">link 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                                <label htmlFor="cdn_import" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">import 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                                <label htmlFor="cdn_font_face" className="w-[25%] h-[100%] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">font-face 방식</label>
                            </div>
                            <div className="w-[1000px] tlg:w-[100%] border-x border-b rounded-b-[8px] border-theme-4 dark:border-theme-blue-2 bg-theme-4 dark:bg-theme-blue-2">
                                {
                                    webFont === "CSS"
                                    ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_css}</pre></div>
                                        <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] rounded-[6px] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                    : ( webFont === "link"
                                        ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                            <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_link}</pre></div>
                                            <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                            </div>
                                        </div>
                                        : ( webFont === "import"
                                            ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_import}</pre></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                            : <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[auto] py-[24px] tlg:py-[20px] tmd:py-[15px] flex flex-row justify-start items-center overflow-auto whitespace-nowrap"><div id="cdn-font-face" style={{fontFamily:"Noto Sans KR"}} className="font-face text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_font_face}</div></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[36px] tlg:top-[30px] tmd:top-[24px] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
                <div className="max-w-[100%] w-content flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">폰트 미리보기</h2>
                    <div className="w-[100%] px-[16px] py-[8px] mb-[20px] tlg:mb-[16px] border-b border-theme-7 dark:border-theme-4">
                        <textarea onChange={handleFontWeightChange} onInput={handleHeightChange} placeholder="원하는 문구를 적어보세요..." className="w-[100%] h-[18px] resize-none text-[14px] text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-tight bg-transparent"/>
                    </div>
                    <div className="font-preview-wrap max-w-[100%] overflow-hidden rounded-[12px] p-[32px] pb-[16px] tlg:p-[20px] tlg:pt-[28px] tlg:pb-[14px] bg-theme-4 dark:bg-theme-blue-2">
                        <div className="w-[100%] flex flex-row flex-wrap justify-start items-center">
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    폰트 크기<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Font Size</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] mx-[34px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        aria-valuetext="px"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnAddUnit}
                                        onChange={(e, v) => setFontSize(Number(v))}
                                        defaultValue={20}
                                        min={12}
                                        max={64}
                                    />
                                    <div className="absolute left-[-34px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">12px</div>
                                    <div className="absolute right-[-34px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">64px</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    행간<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Line Height</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] mx-[20px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnLineheightValue}
                                        onChange={(e, v) => setLineHeight(Number(v)/10)}
                                        defaultValue={12}
                                        min={10}
                                        max={20}
                                    />
                                    <div className="absolute left-[-18px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">1</div>
                                    <div className="absolute right-[-18px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">2</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    자간<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Letter Spacing</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] ml-[48px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnLetterSpacingValue}
                                        onChange={(e, v) => setLetterSpacing(Number(v)/10)}
                                        defaultValue={0}
                                        min={-5}
                                        max={10}
                                    />
                                    <div className="absolute left-[-48px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">-0.5em</div>
                                    <div className="absolute right-[-32px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">1em</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[100%] h-px mb-[36px] tlg:mb-[28px] bg-theme-5"></div>
                        {
                            font.font_weight[0] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Thin 100</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"100"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[1] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">ExtraLight 200</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"200"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[2] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Light 300</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"300"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[3] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Regular 400</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"400"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[4] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Medium 500</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"500"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[5] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">SemiBold 600</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"600"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[6] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Bold 700</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"700"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[7] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Heavy 800</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"800"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[8] === "Y"
                            ? <>
                                <div className="text-[14px] tmd:text-[12px] text-theme-7 leading-none mb-[12px]">Black 900</div>
                                <pre style={{fontFamily:font.font_family, fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"900"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                    </div>
                </div>
                <div>
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">라이센스 사용 범위</h2>
                    <div className="w-[100%] flex flex-row tlg:flex-col justify-between items-start">
                        <table className="tlg:w-[100%] tlg:mb-[16px] tmd:mb-[12px] text-left rounded-[12px] border border-theme-7 dark:border-theme-5">
                            <thead className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                <tr className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-9 font-medium">
                                    <th className="w-[120px] tlg:w-[100px] tmd:w-[80px] pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">카테고리</th>
                                    <th className="w-[450px] tlg:w-[auto]">사용 범위</th>
                                    <th className="w-[100px] tmd:w-[80px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] text-right">허용 여부</th>
                                </tr>
                            </thead>
                            <tbody className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-5 dark:text-theme-7 fill-theme-5 dark:fill-theme-7 text-left font-normal">
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">인쇄</td>
                                    <td>
                                        {
                                            font.license_print === "Y"
                                            ? <span>브로슈어, 포스터, 책, 잡지 및 출판용 인쇄물 등</span>
                                            : <span className="text-theme-red/80 line-through">브로슈어, 포스터, 책, 잡지 및 출판용 인쇄물 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_print === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_print === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_print === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">웹사이트</td>
                                    <td>
                                        {
                                            font.license_web === "Y"
                                            ? <span>웹페이지, 광고 배너, 메일, E-브로슈어 등</span>
                                            : <span className="text-theme-red/80 line-through">웹페이지, 광고 배너, 메일, E-브로슈어 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_web === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_web === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_web === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">영상</td>
                                    <td>
                                        {
                                            font.license_video === "Y"
                                            ? <span>영상물 자막, 영화 오프닝/엔딩 크레딧, UCC 등</span>
                                            : <span className="text-theme-red/80 line-through">영상물 자막, 영화 오프닝/엔딩 크레딧, UCC 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_video === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_video === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_video === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">포장지</td>
                                    <td>
                                        {
                                            font.license_package === "Y"
                                            ? <span>판매용 상품의 패키지</span>
                                            : <span className="text-theme-red/80 line-through">판매용 상품의 패키지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_package === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_package === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_package === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">임베딩</td>
                                    <td>
                                        {
                                            font.license_embed === "Y"
                                            ? <span>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                            : <span className="text-theme-red/80 line-through">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_embed === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_embed === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_embed === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">BI/CI</td>
                                    <td>
                                        {
                                            font.license_bici === "Y"
                                            ? <span>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                            : <span className="text-theme-red/80 line-through">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_bici === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_bici === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_bici === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">OFL</td>
                                    <td>
                                        {
                                            font.license_ofl === "Y"
                                            ? <span>폰트 파일의 수정/ 복제/ 배포 가능. 단, 폰트 파일의 유료 판매는 금지</span>
                                            : <span className="text-theme-red/80 line-through">폰트 파일의 수정/ 복제/ 배포/ 유료 판매 금지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_ofl === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">용도</td>
                                    <td>
                                        {
                                            font.license_purpose === "Y"
                                            ? <span>개인적, 상업적 용도 모두 사용 가능</span>
                                            : <span className="text-theme-red/80 line-through">개인적 용도 사용 가능, 상업적 용도 사용 금지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_purpose === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px]">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">출처</td>
                                    <td>출처 표시</td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_source === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <span>권장</span>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="w-[calc(100%-690px)] tlg:w-[100%] h-[450px] tlg:h-[auto] border border-theme-7 dark:border-theme-5">
                            <h2 className="h-[44px] flex flex-row justify-start items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-9 border-b border-theme-7 dark:border-theme-5 font-medium leading-none pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">라이센스 본문</h2>
                            <div className="license-wrap w-[100%] h-[404px] tlg:h-[auto] overflow-y-auto px-[20px] tlg:px-[16px] tmd:px-[12px] py-[8px]">
                                <div id="license" className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-5 dark:text-theme-7 leading-loose"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Google AdSense */}
                {/* <div className="w-[100%] h-[160px] flex flex-row justify-center items-center mt-[20px] tlg:mt-[16px] tmd:mt-[12px] border border-theme-7 dark:border-theme-5">
                    <svg className="h-[40px] fill-theme-7 dark:fill-theme-5" viewBox="0 0 1000 145" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M989.383 84.5722C989.162 81.5433 987.772 78.6558 985.21 75.9049C982.643 73.1682 978.837 71.7927 973.777 71.7927C970.094 71.7927 966.905 72.9468 964.192 75.2596C961.483 77.5677 959.623 80.6766 958.614 84.5769H989.383L989.383 84.5722ZM975.082 119.241C967.065 119.241 960.546 116.575 955.534 111.229C950.503 105.882 947.997 99.1323 947.997 90.969C947.997 83.2438 950.432 76.5974 955.308 71.0343C960.183 65.4712 966.415 62.692 973.994 62.692C981.865 62.692 988.173 65.2545 992.902 70.3842C997.631 75.5139 1000 82.3723 1000 90.9689L999.888 92.806H957.965C958.252 98.1571 960.042 102.382 963.325 105.487C966.613 108.595 970.457 110.145 974.866 110.145C982.016 110.145 986.854 107.112 989.383 101.045L998.267 104.728C996.534 108.845 993.679 112.298 989.704 115.077C985.738 117.851 980.858 119.246 975.082 119.246L975.082 119.241ZM921.958 119.246C916.036 119.246 911.147 117.8 907.284 114.912C903.513 112.146 900.57 108.399 898.777 104.078L907.661 100.395C910.478 107.041 915.283 110.362 922.071 110.362C925.18 110.362 927.723 109.679 929.711 108.304C931.689 106.933 932.688 105.124 932.688 102.882C932.688 99.4196 930.272 97.0739 925.429 95.8444L914.704 93.2395C911.307 92.3775 908.095 90.7335 905.061 88.3171C902.032 85.8959 900.511 82.6268 900.511 78.5098C900.511 73.8136 902.583 70.0027 906.743 67.0823C910.888 64.1571 915.82 62.6921 921.529 62.6921C926.22 62.6921 930.413 63.7614 934.096 65.8858C937.71 67.935 940.504 71.17 942.005 75.043L933.338 78.6182C931.388 73.922 927.346 71.5761 921.204 71.5761C918.236 71.5761 915.754 72.1932 913.728 73.4179C911.703 74.6473 910.695 76.3101 910.695 78.4015C910.695 81.4351 913.041 83.4935 917.742 84.577L928.246 87.0688C933.234 88.2229 936.913 90.2107 939.297 93.0276C941.685 95.8445 942.872 99.0239 942.872 102.562C942.872 107.329 940.922 111.299 937.021 114.479C933.121 117.654 928.1 119.246 921.962 119.246M854.033 64.4255V71.788H854.466C855.907 69.2632 858.187 67.1151 861.291 65.344C864.321 63.5947 867.76 62.6797 871.259 62.692C877.834 62.692 882.847 64.7175 886.318 68.7591C889.785 72.8007 891.519 78.2272 891.519 85.0102V117.512H881.551V86.5224C881.551 76.701 877.18 71.7881 868.447 71.7881C864.33 71.7881 860.971 73.4367 858.366 76.7199C855.766 80.0078 854.466 83.8139 854.466 88.1475V117.513H844.503V64.4256C844.503 64.4256 854.033 64.4256 854.033 64.4255ZM825.539 84.5722C825.322 81.5433 823.928 78.6558 821.366 75.9049C818.803 73.1682 814.992 71.7927 809.938 71.7927C806.254 71.7927 803.061 72.9468 800.348 75.2596C797.639 77.5677 795.783 80.6766 794.77 84.5769H825.539V84.5722ZM811.238 119.241C803.221 119.241 796.702 116.575 791.685 111.229C786.664 105.882 784.153 99.1323 784.153 90.969C784.153 83.2438 786.588 76.5974 791.468 71.0343C796.344 65.4712 802.571 62.692 810.155 62.692C818.026 62.692 824.328 65.2545 829.062 70.3842C833.792 75.5139 836.156 82.3723 836.156 90.9689L836.048 92.806H794.12C794.412 98.1571 796.198 102.382 799.485 105.487C802.769 108.595 806.612 110.145 811.021 110.145C818.177 110.145 823.01 107.112 825.539 101.045L834.423 104.728C832.694 108.845 829.835 112.298 825.864 115.077C821.893 117.851 817.013 119.246 811.238 119.246L811.238 119.241ZM751.241 119.246C745.612 119.246 740.101 117.399 734.721 113.721C729.342 110.037 725.818 104.874 724.156 98.2279L733.261 94.5443C734.303 98.7436 736.632 102.512 739.922 105.322C743.275 108.247 747.049 109.712 751.236 109.712C755.575 109.712 759.272 108.572 762.344 106.297C765.415 104.026 766.95 100.936 766.95 97.0361C766.95 92.7024 765.415 89.3627 762.344 87.0121C759.272 84.6664 754.416 82.4807 747.774 80.4599C740.911 78.2931 735.706 75.4951 732.168 72.0612C728.635 68.632 726.864 64.2465 726.864 58.8954C726.864 53.3371 729.069 48.4947 733.478 44.3778C737.877 40.2608 743.619 38.207 750.699 38.207C757.27 38.207 762.617 39.851 766.734 43.1389C770.851 46.422 773.517 50.0162 774.751 53.9165L765.65 57.7083C765.005 55.2542 763.389 52.9791 760.831 50.8829C758.264 48.7867 754.962 47.741 750.921 47.741C747.086 47.741 743.822 48.8055 741.113 50.9347C738.405 53.0685 737.048 55.7253 737.048 58.8954C737.048 61.7923 738.297 64.2229 740.788 66.2107C743.28 68.1985 746.945 69.9886 751.783 71.576C755.612 72.8054 758.801 73.9972 761.373 75.1513C764.122 76.418 766.736 77.9598 769.174 79.7534C771.807 81.6659 773.79 84.0494 775.132 86.9086C776.466 89.7584 777.134 93.0605 777.134 96.8194C777.134 100.574 776.362 103.932 774.807 106.895C773.371 109.723 771.248 112.144 768.632 113.937C763.495 117.404 757.438 119.253 751.241 119.246ZM689.477 110.141C694.169 110.141 698.159 108.412 701.447 104.94C704.73 101.473 706.378 96.8195 706.378 90.9691C706.378 85.1187 704.73 80.4553 701.447 76.9931C698.159 73.5263 694.169 71.7881 689.482 71.7881C684.856 71.7881 680.881 73.5403 677.565 77.0449C674.234 80.5495 672.571 85.194 672.571 90.969C672.571 96.744 674.234 101.389 677.565 104.888C680.881 108.393 684.856 110.141 689.482 110.141M687.847 119.246C680.984 119.246 675.063 116.533 670.089 111.116C665.096 105.703 662.609 98.9862 662.609 90.969C662.609 82.9517 665.096 76.2347 670.084 70.8129C675.063 65.3958 680.984 62.692 687.847 62.692C691.898 62.692 695.526 63.554 698.738 65.2922C701.951 67.0257 704.353 69.1925 705.945 71.7927H706.378L705.945 64.4255V39.9405H715.908V117.508H706.379V110.141H705.945C704.353 112.745 701.951 114.912 698.738 116.646C695.521 118.375 691.894 119.246 687.847 119.246ZM612.23 87.1724H638.02L625.34 52.1784H624.906L612.23 87.1771L612.23 87.1724ZM590.232 117.508L619.484 39.9406H630.761L660.013 117.508H648.962L641.482 96.4992H608.872L601.288 117.508H590.237H590.232Z"/><path fillRule="evenodd" clipRule="evenodd" d="M519.024 90.1189L544.29 79.624C542.896 76.0911 538.727 73.6323 533.8 73.6323C527.484 73.6322 518.708 79.2 519.024 90.1189ZM548.681 100.289L558.314 106.709C555.214 111.316 547.715 119.239 534.761 119.239C518.708 119.239 507.111 106.817 507.111 90.9762C507.111 74.1598 518.812 62.7086 533.372 62.7086C548.04 62.7086 555.214 74.3812 557.565 80.698L558.851 83.9104L521.058 99.5397C523.951 105.216 528.444 108.103 534.761 108.103C541.073 108.103 545.468 104.995 548.681 100.284M487.435 117.524H499.852V34.4459H487.435V117.524ZM467.175 91.0799C467.175 81.1267 460.534 73.8442 452.078 73.8442C443.519 73.8442 436.341 81.1266 436.341 91.0799C436.341 100.929 443.519 108.104 452.074 108.104C460.534 108.104 467.175 100.929 467.175 91.0799ZM478.09 64.4233V115.169C478.09 136.046 465.781 144.614 451.221 144.614C437.514 144.614 429.27 135.405 426.171 127.911L436.981 123.412C438.913 128.015 443.623 133.474 451.221 133.474C460.534 133.474 466.318 127.694 466.318 116.884V112.814H465.889C463.106 116.238 457.75 119.239 451.004 119.239C436.873 119.239 423.919 106.926 423.919 91.0798C423.919 75.1302 436.873 62.7086 451.004 62.7086C457.75 62.7086 463.106 65.7045 465.889 69.0254H466.313V64.4233H478.09ZM342.569 90.9762C342.569 80.8015 335.315 73.8442 326.907 73.8442C318.499 73.8442 311.245 80.8063 311.245 90.9762C311.245 101.038 318.499 108.103 326.907 108.103C335.315 108.104 342.569 101.038 342.569 90.9762ZM354.76 90.9762C354.76 107.246 342.254 119.239 326.907 119.239C311.56 119.239 299.054 107.246 299.054 90.9762C299.054 74.5932 311.56 62.7133 326.907 62.7133C342.254 62.7134 354.76 74.5885 354.76 90.9762ZM405.016 90.9762C405.016 80.8015 397.762 73.8442 389.354 73.8442C380.946 73.8442 373.691 80.8063 373.691 90.9762C373.691 101.038 380.946 108.103 389.354 108.103C397.762 108.103 405.016 101.038 405.016 90.9762ZM417.211 90.9762C417.211 107.246 404.7 119.239 389.354 119.239C374.007 119.239 361.501 107.246 361.501 90.9762C361.501 74.5932 374.007 62.7133 389.354 62.7133C404.7 62.7133 417.211 74.5885 417.211 90.9762ZM251.328 119.239C227.139 119.239 206.795 99.5398 206.795 75.3469C206.795 51.1492 227.139 31.4453 251.332 31.4453C264.72 31.4453 274.244 36.6974 281.418 43.5512L272.958 52.0065C267.819 47.1876 260.862 43.4428 251.332 43.4428C233.668 43.4428 219.852 57.6825 219.852 75.3468C219.852 93.011 233.668 107.246 251.332 107.246C262.788 107.246 269.317 102.644 273.495 98.4658C276.92 95.046 279.171 90.1188 280.024 83.3735H251.328V71.3853H291.687C292.12 73.5238 292.332 76.0957 292.332 78.8749C292.332 87.8719 289.869 99.0075 281.951 106.93C274.239 114.957 264.39 119.239 251.328 119.239Z"/><path fillRule="evenodd" clipRule="evenodd" d="M92.6652 35.5987C99.2976 24.2465 95.3596 9.73821 83.8708 3.18129C72.3772 -3.36631 57.6853 0.515116 51.053 11.8673C50.7607 12.3759 50.4857 12.8944 50.2286 13.4218L27.8068 51.7791C27.3108 52.5416 26.8517 53.3276 26.4313 54.1343L3.14746 94.3146L44.755 117.636L67.921 77.7949C68.4258 77.0379 68.8852 76.2514 69.2964 75.4397L91.7182 37.0777C92.0434 36.5973 92.3685 36.1074 92.6652 35.5987Z"/><mask id="path-4-inside-1_623_3" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M44.948 117.514C38.3533 129.05 23.4776 133.294 12.0547 126.639C0.627145 119.978 -3.42857 105.536 3.17078 94.0043C9.77012 82.4732 24.5139 78.2102 35.9415 84.8661C47.3691 91.5267 51.5425 105.983 44.9479 117.51"/></mask>
                        <path fillRule="evenodd" clipRule="evenodd" d="M44.948 117.514C38.3533 129.05 23.4776 133.294 12.0547 126.639C0.627145 119.978 -3.42857 105.536 3.17078 94.0043C9.77012 82.4732 24.5139 78.2102 35.9415 84.8661C47.3691 91.5267 51.5425 105.983 44.9479 117.51"/><path d="M12.0547 126.639L11.5512 127.503L11.5513 127.503L12.0547 126.639ZM35.9415 84.8661L36.445 84.0021L36.4448 84.002L35.9415 84.8661ZM44.0798 117.018C37.7506 128.09 23.4833 132.14 12.5582 125.775L11.5513 127.503C23.4719 134.448 38.9561 130.011 45.8161 118.011L44.0798 117.018ZM12.5583 125.775C1.59444 119.384 -2.28172 105.545 4.03869 94.5011L2.30286 93.5076C-4.57542 105.526 -0.340147 120.572 11.5512 127.503L12.5583 125.775ZM4.03869 94.5011C10.3746 83.4301 24.5117 79.3662 35.4382 85.7302L36.4448 84.002C24.5161 77.0542 9.1656 81.5162 2.30286 93.5076L4.03869 94.5011ZM35.4379 85.73C46.4092 92.1247 50.3915 105.981 44.0799 117.013L45.8158 118.006C52.6935 105.985 48.3289 90.9287 36.445 84.0021L35.4379 85.73Z" mask="url(#path-4-inside-1_623_3)"/><path fillRule="evenodd" clipRule="evenodd" d="M134.734 43.1933C123.377 36.648 108.865 40.524 102.283 51.8606L78.5285 92.9076C71.9837 104.221 75.8494 118.698 87.1627 125.243C87.1832 125.254 87.2035 125.266 87.224 125.278C98.5835 131.826 113.099 127.947 119.679 116.606L143.429 75.5636C149.973 64.2467 146.104 49.7677 134.787 43.2239C134.769 43.2137 134.751 43.2035 134.734 43.1933Z"/>
                    </svg>
                </div> */}
            </div>
            
            {/* 폰트 검색 */}
            <FontSearch display={searchDisplay} closeBtn={handleFontSearchCloseBtn} showBtn={handleFontSearch}/>
        </>
    )
}

// getStaticProps
// export async function getStaticPaths() {
//     try {
//         const fonts = await FetchFont();

//         const paths = fonts.map((font: any) => ({
//             params: { fontId: font.code.toString() },
//         }));

//         return { paths, fallback: false }
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function getStaticProps(ctx: any) {
//     try {
//         const fonts = await FetchFontInfo(ctx.params.fontId);
//         const randomNum: number = Math.floor(Math.random() * 19);

//         return {
//             props: {
//                 fonts: fonts,
//                 randomNum: randomNum,
//                 initFontSize: 20,
//                 initLineHeight: 1.2,
//                 initLetterSpacing: 0
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getServerSideProps(ctx: any) {
    try {
        const fonts = await FetchFontInfo(ctx.params.fontId);
        const view = await FetchView(ctx.params.fontId);

        const randomNum: number = Math.floor(Math.random() * 19);

        return {
            props: {
                params: {
                    fonts: fonts,
                    view: view,
                    initFontSize: 20,
                    initLineHeight: 1.2,
                    initLetterSpacing: 0,
                    randomNum: randomNum,
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;
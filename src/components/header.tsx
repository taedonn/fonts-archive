// next hooks
import Link from "next/link";
import Image from "next/image";

// react hooks
import { useEffect, useRef, useState } from "react";

// hooks
import { useCookies } from "react-cookie";
import { throttle } from "lodash";
import axios from "axios";

// components
import FontSearch from "./fontsearch";

export default function Header (
    {
        isMac,
        theme,
        user,
        page,
        lang,
        type,
        sort,
        source,
        handleTextChange,
        handleLangOptionChange,
        handleTypeOptionChange,
        handleSortOptionChange,
        handleSearch,
    }:
    {
        isMac: boolean,
        theme: string,
        user: any,
        page: string,
        lang: string,
        type: string,
        sort: string,
        source: string,
        handleTextChange: any,
        handleLangOptionChange: any,
        handleTypeOptionChange: any,
        handleSortOptionChange: any,
        handleSearch: any,
    }
) {
    // 쿠키 훅
    const [cookies, setCookie] = useCookies<string>([]);

    // 셀렉트 박스 - "언어 선택" 영역
    const refLangSelect = useRef<HTMLLabelElement>(null);
    const refLangOption = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 - "언어 선택" 외 영역 클릭
    useEffect(() => {
        function handleLangOutside(e:Event) {
            const selectInput = document.getElementById("select-lang") as HTMLInputElement;
            if (refLangSelect?.current && !refLangSelect.current.contains(e.target as Node) && refLangOption.current && !refLangOption.current.contains(e.target as Node)) {
                selectInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleLangOutside);
        return () => document.removeEventListener("mouseup", handleLangOutside);
    },[refLangOption]);

    /** 셀렉트 박스 - "언어 선택" 클릭 */
    const handleLangChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const option = document.getElementById("option-lang") as HTMLDivElement;
        if (e.target.checked) {
            option.classList.add("animate-fade-in");
            setTimeout(function() { option.classList.remove('animate-fade-in'); },600);
        }
    }

    // 셀렉트 박스 - "폰트 형태" 영역
    const refTypeSelect = useRef<HTMLLabelElement>(null);
    const refTypeOption = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 - "폰트 형태" 외 영역 클릭
    useEffect(() => {
        function handleTypeOutside(e:Event) {
            const selectInput = document.getElementById("select-type") as HTMLInputElement;
            if (refTypeSelect?.current && !refTypeSelect.current.contains(e.target as Node) && refTypeOption.current && !refTypeOption.current.contains(e.target as Node)) {
                selectInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleTypeOutside);
        return () => document.removeEventListener("mouseup", handleTypeOutside);
    },[refTypeOption]);

    /** 셀렉트 박스 - "폰트 형태" 클릭 */
    const handleTypeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const option = document.getElementById("option-type") as HTMLDivElement;
        if (e.target.checked) {
            option.classList.add("animate-fade-in");
            setTimeout(function() { option.classList.remove('animate-fade-in'); },600);
        }
    }

    // 셀렉트 박스 - "정렬순" 영역
    const refSortSelect = useRef<HTMLLabelElement>(null);
    const refSortOption = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 - 정렬순" 외 영역 클릭
    useEffect(() => {
        function handleSortOutside(e:Event) {
            const selectInput = document.getElementById("select-sort") as HTMLInputElement;
            if (refSortSelect?.current && !refSortSelect.current.contains(e.target as Node) && refSortOption.current && !refSortOption.current.contains(e.target as Node)) {
                selectInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleSortOutside);
        return () => document.removeEventListener("mouseup", handleSortOutside);
    },[refSortOption]);

    /** 셀렉트 박스 - "정렬순" 클릭 */
    const handleSortChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const option = document.getElementById("option-sort") as HTMLDivElement;
        if (e.target.checked) {
            option.classList.add("animate-fade-in");
            setTimeout(function() { option.classList.remove('animate-fade-in'); },600);
        }
    }

    // 컬러 테마 영역
    const refThemeLabel = useRef<HTMLLabelElement>(null);
    const refThemeDiv = useRef<HTMLDivElement>(null);

    // 컬러 테마 영역 외 클릭
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

    // 컬러 테마 디폴트: 나잇 모드
    const [thisTheme, setTheme] = useState(theme);

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

    // 계정 영역
    const refAccountLabel = useRef<HTMLLabelElement>(null);
    const refAccountDiv = useRef<HTMLDivElement>(null);

    // 계정 영역 외 클릭
    useEffect(() => {
        function handleAccountOutside(e:Event) {
            const account = document.getElementById("account") as HTMLInputElement;
            if (refAccountDiv?.current && !refAccountDiv.current.contains(e.target as Node) && refAccountLabel.current && !refAccountLabel.current.contains(e.target as Node)) {
                account.checked = false;
            }
        }
        document.addEventListener("mouseup", handleAccountOutside);
        return () => document.removeEventListener("mouseup", handleAccountOutside);
    },[refAccountDiv, refAccountLabel]);

    /** 계정 선택창 팝업 */
    const handleAccount = (e:React.ChangeEvent<HTMLInputElement>) => {
        const accountSelect = document.getElementById("account-select") as HTMLDivElement;
        if (e.target.checked) {
            accountSelect.classList.add("animate-account-fade-in");
            setTimeout(function() { accountSelect.classList.remove('animate-account-fade-in'); },600);
        }
    }

    /** lodash/throttle을 이용해 스크롤 제어 */
    const handleScroll = () => {
        if (page === "index") {
            const inputLang = document.getElementById("select-lang") as HTMLInputElement;
            const inputType = document.getElementById("select-type") as HTMLInputElement;
            const inputSort = document.getElementById("select-sort") as HTMLInputElement;
            const inputTheme = document.getElementById("color-theme") as HTMLInputElement;
            const inputAccount = document.getElementById("account") as HTMLInputElement;
            inputLang.checked = false;
            inputType.checked = false;
            inputSort.checked = false;
            inputTheme.checked = false;
            inputAccount.checked = false;
        } else {
            const inputAccount = document.getElementById("account") as HTMLInputElement;
            const inputTheme = document.getElementById("color-theme") as HTMLInputElement;
            inputTheme.checked = false;
            inputAccount.checked = false;
        }
    }
    const throttledScroll = throttle(handleScroll,500);

    // lodash/throttle을 이용해 스크롤
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    // 폰트 검색 디폴트: 숨김
    const [searchDisplay, setSearchDisplay] = useState("hide");

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

    /** 로그아웃 버튼 클릭 */
    const handleLogout = async () => {
        await axios.get('/api/user/logout').then(() => {
            if (location.search.includes('session')) { location.href = location.href.replace(location.search, ''); } 
            else { location.reload(); }
        });
    }

    return (
        <>
            <header className="w-[100%] mt-[60px] tlg:mt-[52px]">
                <div className='interface w-[100%] h-[60px] tlg:h-[52px] px-[32px] tlg:px-[16px] fixed right-0 top-0 z-20 flex flex-row justify-between items-center backdrop-blur bg-theme-9/80 dark:bg-theme-2/80 border-b border-theme-7 dark:border-theme-4'>
                    <div className="tlg:w-[100%] flex flex-row justify-start items-center">
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/" aria-label="logo" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-theme-4 dark:bg-theme-1/80 hover:dark:bg-theme-1/60 tlg:hover:dark:bg-theme-1/80 hover:drop-shadow-default tlg:hover:drop-shadow-none hover:dark:drop-shadow-dark tlg:hover:dark:drop-shadow-none">
                            <svg className="w-[18px] tlg:w-[16px] pb-px fill-theme-10 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                        </a>
                        {
                            page === "index"
                            ? <>
                                <div className="tlg:w-[calc(100%-56px)] relative group">
                                    <input onChange={handleTextChange} type='text' placeholder='원하는 문구를 적어보세요...' className="w-[400px] txl:w-[260px] tlg:w-[100%] text-[14px] tlg:text-[12px] text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-4 px-[20px] tlg:px-[16px] py-[10px] tlg:py-[8px] pl-[52px] tlg:pl-[38px] bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40 tlg:focus:bg-transparent"/>
                                    <svg className="w-[16px] tlg:w-[14px] absolute left-[24px] tlg:left-[16px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                                </div>
                            </> : <></>
                        }
                    </div>
                    <div className='w-content flex flex-row justify-start items-center'>
                        {
                            page === "index"
                            ? <>
                                <div className="flex flex-row justify-end items-center tlg:hidden">
                                    <div className='w-content relative flex flex-row justify-start items-center'>
                                        <input type='checkbox' id='select-lang' onChange={handleLangChange} className="select hidden"/>
                                        <label ref={refLangSelect} htmlFor='select-lang' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-5 dark:text-theme-8 leading-none tracking-normal px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-5 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10/80 hover:dark:text-theme-9 hover:fill-theme-10/80 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] flex flex-row justify-center items-center text-inherit leading-[32px] text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                언어 선택
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refLangOption} id="option-lang" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-all" name="option-lang" value="all" className="option-input hidden" defaultChecked={lang === "all" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-lang-all'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10/80 dark:text-theme-9 leading-tight tlg:pb-px">전체</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-kr" name="option-lang" value="kr" className="option-input hidden" defaultChecked={lang === "kr" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-lang-kr'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10/80 dark:text-theme-9 leading-tight tlg:pb-px">한국어</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-en" name="option-lang" value="en" className="option-input hidden" defaultChecked={lang === "en" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-lang-en'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10/80 dark:text-theme-9 leading-tight tlg:pb-px">영어</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-content relative flex flex-row justify-start items-center ml-[8px]'>
                                        <input type='checkbox' id='select-type' onChange={handleTypeChange} className="select hidden"/>
                                        <label ref={refTypeSelect} htmlFor='select-type' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-5 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-5 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10/80 hover:dark:text-theme-10/80 hover:fill-theme-10/80 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                폰트 형태
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refTypeOption} id="option-type" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-all" name="option-type" value="all" className="option-input hidden" defaultChecked={type === "all" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-all'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">전체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-sans-serif" name="option-type" value="sans-serif" className="option-input hidden" defaultChecked={type === "sans-serif" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-sans-serif'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">고딕</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-serif" name="option-type" value="serif" className="option-input hidden" defaultChecked={type === "serif" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-serif'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">명조</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-hand-writing" name="option-type" value="hand-writing" className="option-input hidden" defaultChecked={type === "hand-writing" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-hand-writing'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">손글씨</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-display" name="option-type" value="display" className="option-input hidden" defaultChecked={type === "display" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-display'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">장식체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-pixel" name="option-type" value="pixel" className="option-input hidden" defaultChecked={type === "pixel" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-type-pixel'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">픽셀체</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-content relative flex flex-row justify-start items-center ml-[8px]'>
                                        <input type='checkbox' id='select-sort' onChange={handleSortChange} className="select hidden"/>
                                        <label ref={refSortSelect} htmlFor='select-sort' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-5 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-5 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10/80 hover:dark:text-theme-9 hover:fill-theme-10/80 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                {sort === "like" ? "인기순" : sort === "view" ? "조회순" : sort === "date" ? "최신순" : "이름순"}
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refSortOption} id="option-sort" className='option w-[114px] tlg:w-[96px] tmd:w-[88px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[22px] tlg:py-[16px] tmd:py-[14px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-like" name="option-sort" value="like" className="option-input hidden" defaultChecked={sort === "like" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-like'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">인기순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-view" name="option-sort" value="view" className="option-input hidden" defaultChecked={sort === "view" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-view'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">조회순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-latest" name="option-sort" value="date" className="option-input hidden" defaultChecked={sort === "date" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-latest'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">최신순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-name" name="option-sort" value="name" className="option-input hidden" defaultChecked={sort === "name" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-sort-name'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10/80 dark:text-theme-9 leading-tight">이름순</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-px h-[20px] tlg:h-[16px] rounded-full mx-[10px] tlg:mx-[8px] bg-theme-7 dark:bg-theme-4'></div>
                                </div>
                                <div className="w-content relative tlg:hidden">
                                    <input onChange={handleSearch} type="text" placeholder="폰트, 회사명을 검색해 보세요..." defaultValue={source} className="w-[280px] txl:w-[200px] text-[14px] text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-4 px-[20px] py-[10px] pl-[44px] bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40"/>
                                    <svg className="w-[12px] absolute left-[20px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                                </div>
                            </> : <></>
                        }
                        <button onClick={handleFontSearch} className={`${page === "index" ? "hidden tlg:flex" : "flex"} w-[220px] tlg:w-[200px] tmd:w-[32px] h-[32px] tlg:h-[30px] relative text-[14px] tlg:text-[12px] text-normal text-theme-5 dark:text-theme-8 leading-none bg-theme-8 dark:bg-theme-3/80 flex-start justify-start items-center rounded-[8px] tmd:rounded-[6px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:bg-theme-8 hover:bg-theme-7/60 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none`}>
                            <span className="tmd:hidden mt-px">폰트 검색하기...</span>
                            <svg className="w-[12px] tlg:w-[10px] tmd:w-[12px] absolute left-[16px] tlg:left-[12px] tmd:left-[50%] top-[50%] tmd:translate-x-[-50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                            <div className="w-content h-[100%] absolute right-[16px] flex flex-row justify-center items-center">
                                {
                                    isMac === true
                                    ? <div className="flex flex-row justify-center items-center">
                                        <svg className="tmd:hidden w-[11px] fill-theme-5 dark:fill-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                        <span className="tmd:hidden text-[12px] leading-none pt-px">K</span>
                                    </div>
                                    : ( isMac === false
                                        ? <span className="tmd:hidden mt-px text-[12px] leading-none">Ctrl + K</span>
                                        : <></>
                                    )
                                }
                            </div>
                        </button>
                        <div className='w-px h-[20px] tlg:h-[16px] rounded-full mx-[10px] tlg:mx-[8px] mr-[6px] tlg:mr-[4px] bg-theme-7 dark:bg-theme-4'></div>
                        <div className="relative mx-[10px] txl:mx-[8px]">
                            <input onChange={handleColorTheme} type="checkbox" id="color-theme" className="hidden"/>
                            <label ref={refThemeLabel} htmlFor="color-theme" className="w-[32px] h-[32px] flex flex-row justify-center items-center cursor-pointer">
                                <svg style={thisTheme === "light" ? {display: "block"} : {display: "none"}} className={`light-mode w-[20px] ${thisTheme === "light" ? `fill-theme-yellow` : `fill-theme-9/80`}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                                <svg style={thisTheme === "dark" ? {display: "block"} : {display: "none"}} className={`dark-mode w-[20px] ${thisTheme === "dark" ? `fill-theme-blue-1` : `fill-theme-9/80`}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg>
                            </label>
                            <div ref={refThemeDiv} id="color-theme-select" className="color-theme-select w-[128px] absolute left-[50%] top-[40px] translate-x-[-50%] rounded-[8px] px-[16px] py-[8px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark">
                                <input onChange={handleColorThemeChange} type="radio" name="color-theme-select" id="light-mode" value="light" className="hidden" defaultChecked={thisTheme === "light" ? true : false}/>
                                <label htmlFor="light-mode" className="flex flex-row justify-start items-center py-[8px] cursor-pointer">
                                    <svg className={`light-mode w-[16px] ${thisTheme === "light" ? "fill-theme-yellow" : "fill-theme-10/80 dark:fill-theme-9/80"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                                    <span className={`text-[14px] ml-[10px] ${thisTheme === "light" ? "text-theme-yellow" : "text-theme-10/80 dark:text-theme-9/80"}`}>라이트 모드</span>
                                </label>
                                <input onChange={handleColorThemeChange} type="radio" name="color-theme-select" id="dark-mode" value="dark" className="hidden" defaultChecked={thisTheme === "dark" ? true : false}/>
                                <label htmlFor="dark-mode" className="flex flex-row justify-start items-center py-[8px] cursor-pointer">
                                    <svg className={`"dark-mode w-[16px] ${thisTheme === "dark" ? "fill-theme-blue-1" : "fill-theme-10/80 dark:fill-theme-9/80"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg>
                                    <span className={`text-[14px] ml-[10px] ${thisTheme === "dark" ? "text-theme-blue-1" : "text-theme-10/80 dark:text-theme-9/80"}`}>다크 모드</span>
                                </label>
                            </div>
                        </div>
                        <div className="relative flex flex-row justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" className="w-[32px] h-[32px] flex flex-row justify-center items-center cursor-pointer">
                                {
                                    user === null
                                    ? <svg className="w-[22px] fill-theme-4/80 hover:fill-theme-4 tlg:hover:fill-theme-4/80 dark:fill-theme-9/80 hover:dark:fill-theme-9 tlg:hover:dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                                    : <Image className="rounded-full" src={user.profile_img} width={28} height={28} alt="유저 프로필 사진"/>
                                }
                            </label>
                            <div ref={refAccountDiv} id="account-select" className="account-select w-[128px] absolute right-[0] top-[40px] rounded-[8px] px-[16px] py-[12px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark cursor-default">
                                <Link href="https://github.com/fonts-archive" target="_blank" className="group flex flex-row justify-start items-center">
                                    <svg className="w-[16px] fill-theme-10/80 group-hover:fill-theme-10 tlg:group-hover:fill-theme-10/80 dark:fill-theme-9/80 group-hover:dark:fill-theme-9 tlg:group-hover:dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                                    <span className="text-[14px] ml-[8px] text-theme-10/80 group-hover:text-theme-10 tlg:group-hover:text-theme-10/80 dark:text-theme-9/80 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme-9/80">깃허브</span>
                                </Link>
                                {
                                    user === null
                                    ? <>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/user/login" className="w-[100%] h-[28px] flex flex-row justify-center items-center rounded-[8px] mt-[10px] bg-theme-yellow/90 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/90 dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/90">
                                            <span className="text-[14px] text-theme-5 dark:text-theme-blue-2 font-medium mt-px">로그인</span>
                                        </a>
                                    </> : <div className="text-[14px] text-theme-10/80 dark:text-theme-9/80">
                                        <div className="w-[100%] h-px bg-theme-8/80 dark:bg-theme-7/80 my-[10px]"></div>
                                        <div>{user.user_name}<span className="text-theme-8/80 dark:text-theme-7/80"> 님,</span></div>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/user/info" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[8px] group">
                                            <svg className="w-[14px] mr-[4px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 5.996V14H3s-1 0-1-1 1-4 6-4c.564 0 1.077.038 1.544.107a4.524 4.524 0 0 0-.803.918A10.46 10.46 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h5ZM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2Zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z"/></svg>
                                            프로필 정보
                                        </a>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/?filter=liked" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-px group">
                                            <svg className="w-[13px] mr-[5px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>
                                            좋아요 보기
                                        </a>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <button onClick={handleLogout} className="w-[100%] h-[28px] flex flex-row justify-center items-center rounded-[8px] mt-[12px] bg-theme-yellow/90 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/90 dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/90">
                                            <span className="text-theme-4 dark:text-theme-blue-2 font-medium mt-px">로그아웃</span>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 폰트 검색 */}
            <FontSearch 
                isMac={isMac}
                display={searchDisplay} 
                closeBtn={handleFontSearchCloseBtn} 
                showBtn={handleFontSearch}
            />
        </>
    )
}
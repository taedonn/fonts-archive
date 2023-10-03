// next hooks
import Link from "next/link";

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
    const [, setCookie] = useCookies<string>([]);

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

        // 쿠키 유효 기간 1년으로 설정
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        if (e.target.checked) {
            setCookie('theme', e.target.value, {path:'/', expires: expires, secure:true, sameSite:'none'});
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

    /** 로그인 버튼 클릭 */
    const handleLoginClick = () => {
        sessionStorage.setItem('login_history', location.href);
    }

    return (
        <>
            <header className="w-[100%] mt-[60px] tlg:mt-[52px]">
                <div className='interface w-[100%] h-[60px] tlg:h-[52px] px-[32px] tlg:px-[16px] fixed right-0 top-0 z-20 flex flex-row justify-between items-center backdrop-blur bg-theme-9/80 dark:bg-theme-2/80 border-b border-theme-7 dark:border-theme-4'>
                    <div className="tlg:w-[100%] flex flex-row justify-start items-center">
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/" aria-label="logo" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-theme-4 dark:bg-theme-1/80 hover:dark:bg-theme-1/60 tlg:hover:dark:bg-theme-1/80 hover:drop-shadow-default tlg:hover:drop-shadow-none hover:dark:drop-shadow-dark tlg:hover:dark:drop-shadow-none">
                            <svg className="w-[18px] tlg:w-[16px] pb-px fill-theme-10 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
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
                                        <label ref={refLangSelect} htmlFor='select-lang' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none tracking-normal px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
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
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10 dark:text-theme-9 leading-tight tlg:pb-px">전체</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-kr" name="option-lang" value="kr" className="option-input hidden" defaultChecked={lang === "kr" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-lang-kr'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10 dark:text-theme-9 leading-tight tlg:pb-px">한국어</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-en" name="option-lang" value="en" className="option-input hidden" defaultChecked={lang === "en" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-lang-en'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] text-theme-10 dark:text-theme-9 leading-tight tlg:pb-px">영어</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-content relative flex flex-row justify-start items-center ml-[8px]'>
                                        <input type='checkbox' id='select-type' onChange={handleTypeChange} className="select hidden"/>
                                        <label ref={refTypeSelect} htmlFor='select-type' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-10/80 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
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
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">전체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-sans-serif" name="option-type" value="sans-serif" className="option-input hidden" defaultChecked={type === "sans-serif" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-sans-serif'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">고딕</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-serif" name="option-type" value="serif" className="option-input hidden" defaultChecked={type === "serif" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-serif'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">명조</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-hand-writing" name="option-type" value="hand-writing" className="option-input hidden" defaultChecked={type === "hand-writing" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-hand-writing'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">손글씨</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-display" name="option-type" value="display" className="option-input hidden" defaultChecked={type === "display" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-type-display'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">장식체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-pixel" name="option-type" value="pixel" className="option-input hidden" defaultChecked={type === "pixel" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-type-pixel'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">픽셀체</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-content relative flex flex-row justify-start items-center ml-[8px]'>
                                        <input type='checkbox' id='select-sort' onChange={handleSortChange} className="select hidden"/>
                                        <label ref={refSortSelect} htmlFor='select-sort' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-4 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
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
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">인기순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-view" name="option-sort" value="view" className="option-input hidden" defaultChecked={sort === "view" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-view'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">조회순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-latest" name="option-sort" value="date" className="option-input hidden" defaultChecked={sort === "date" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-latest'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">최신순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-name" name="option-sort" value="name" className="option-input hidden" defaultChecked={sort === "name" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center'>
                                                <label htmlFor='option-sort-name'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">이름순</span>
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
                        <button onClick={handleFontSearch} className={`${page === "index" ? "hidden tlg:flex" : "flex"} w-[220px] tlg:w-[200px] tmd:w-[32px] h-[32px] tlg:h-[30px] relative text-[14px] tlg:text-[12px] text-normal text-theme-3 dark:text-theme-9 leading-none bg-theme-8 dark:bg-theme-3 flex-start justify-start items-center rounded-[8px] tmd:rounded-[6px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:dark:bg-theme-4 tlg:hover:dark:bg-theme-3 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none`}>
                            <span className="tmd:hidden mt-px">폰트 검색하기...</span>
                            <svg className="w-[12px] tlg:w-[10px] tmd:w-[12px] absolute left-[16px] tlg:left-[12px] tmd:left-[50%] top-[50%] tmd:translate-x-[-50%] translate-y-[-50%] fill-theme-3 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
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
                                    <svg className={`light-mode w-[16px] ${thisTheme === "light" ? "fill-theme-yellow" : "fill-theme-10 dark:fill-theme-9"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>
                                    <span className={`text-[14px] ml-[10px] ${thisTheme === "light" ? "text-theme-yellow" : "text-theme-10 dark:text-theme-9"}`}>라이트 모드</span>
                                </label>
                                <input onChange={handleColorThemeChange} type="radio" name="color-theme-select" id="dark-mode" value="dark" className="hidden" defaultChecked={thisTheme === "dark" ? true : false}/>
                                <label htmlFor="dark-mode" className="flex flex-row justify-start items-center py-[8px] cursor-pointer">
                                    <svg className={`"dark-mode w-[16px] ${thisTheme === "dark" ? "fill-theme-blue-1" : "fill-theme-10 dark:fill-theme-9"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg>
                                    <span className={`text-[14px] ml-[10px] ${thisTheme === "dark" ? "text-theme-blue-1" : "text-theme-10 dark:text-theme-9"}`}>다크 모드</span>
                                </label>
                            </div>
                        </div>
                        <div className="relative flex flex-row justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" className="w-[32px] h-[32px] flex flex-row justify-center items-center cursor-pointer">
                                {
                                    user === null
                                    ? <svg className="w-[22px] fill-theme-4/80 hover:fill-theme-4 tlg:hover:fill-theme-4/80 dark:fill-theme-9/80 hover:dark:fill-theme-9 tlg:hover:dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                                    // eslint-disable-next-line @next/next/no-img-element
                                    : <img className="w-[28px] h-[28px] object-cover rounded-full" src={user.profile_img} width={28} height={28} alt="유저 프로필 사진"/>
                                }
                            </label>
                            <div ref={refAccountDiv} id="account-select" className="account-select w-[136px] absolute right-[0] top-[40px] rounded-[8px] px-[16px] py-[12px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark cursor-default">
                                <Link href="https://github.com/fonts-archive" target="_blank" className="group flex flex-row justify-start items-center">
                                    <svg className="w-[14px] fill-theme-10/80 group-hover:fill-theme-10 tlg:group-hover:fill-theme-10/80 dark:fill-theme-9/80 group-hover:dark:fill-theme-9 tlg:group-hover:dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                                    <span className="text-[13px] ml-[6px] text-theme-10/80 group-hover:text-theme-10 tlg:group-hover:text-theme-10/80 dark:text-theme-9/80 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme-9/80">깃허브</span>
                                </Link>
                                <Link href="https://github.com/orgs/fonts-archive/discussions/1" target="_blank" className="group flex flex-row justify-start items-center mt-[5px]">
                                    <svg className="w-[12px] ml-px mb-px fill-theme-yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"/></svg>
                                    <span className="text-[13px] ml-[7px] text-theme-10/80 group-hover:text-theme-10 tlg:group-hover:text-theme-10/80 dark:text-theme-9/80 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme-9/80">폰트 제보하기</span>
                                </Link>
                                <Link href="https://github.com/orgs/fonts-archive/discussions/2" target="_blank" className="group flex flex-row justify-start items-center mt-[5px]">
                                    <svg className="w-[13px] ml-px mb-px fill-theme-red dark:fill-theme-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96v3.6c0 15.7-12.7 28.4-28.4 28.4H188.4c-15.7 0-28.4-12.7-28.4-28.4V96c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4H312c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6V240c0-8.8-7.2-16-16-16s-16 7.2-16 16V479.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96.3c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"/></svg>
                                    <span className="text-[13px] ml-[6px] text-theme-10/80 group-hover:text-theme-10 tlg:group-hover:text-theme-10/80 dark:text-theme-9/80 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme-9/80">버그 리포트</span>
                                </Link>
                                {
                                    user === null
                                    ? <>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/user/login" onClick={handleLoginClick} className="w-[100%] h-[28px] flex flex-row justify-center items-center rounded-[8px] mt-[10px] bg-theme-yellow/90 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/90 dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/90">
                                            <span className="text-[14px] text-theme-4 dark:text-theme-blue-2 font-medium mt-px">로그인</span>
                                        </a>
                                    </> : <div className="text-[14px] text-theme-10/80 dark:text-theme-9/80">
                                        <div className="w-[100%] h-px bg-theme-8/80 dark:bg-theme-7/80 my-[10px]"></div>
                                        <div>{user.user_name}<span className="text-theme-8/80 dark:text-theme-7/80"> 님,</span></div>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/user/info" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[6px] group">
                                            <svg className="w-[14px] mr-[4px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 5.996V14H3s-1 0-1-1 1-4 6-4c.564 0 1.077.038 1.544.107a4.524 4.524 0 0 0-.803.918A10.46 10.46 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h5ZM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2Zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z"/></svg>
                                            프로필 정보
                                        </a>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/?filter=liked" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[2px] ml-px group">
                                            <svg className='w-[13px] mr-[5px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                                            좋아요 목록
                                        </a>
                                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                        <a href="/user/comments" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[2px] ml-px group">
                                            <svg className="w-[13px] mr-[5px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/></svg>
                                            댓글 목록
                                        </a>
                                        {
                                            user.user_no === 1
                                            ? <>
                                                <div className="w-[100%] h-px bg-theme-8/80 dark:bg-theme-7/80 my-[10px]"></div>
                                                <div>관리자<span className="text-theme-8/80 dark:text-theme-7/80"> 기능</span></div>
                                                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                                <a href="/admin/font/add" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[6px] ml-px group">
                                                    <svg className="w-[14px] mr-[4px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                                                    폰트 추가
                                                </a>
                                                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                                <a href="/admin/font/edit" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[2px] ml-px group">
                                                    <svg className="w-[14px] mr-[4px] mb-px fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                                                    폰트 수정
                                                </a>
                                                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                                <a href="/admin/user/list" className="flex flex-row justify-start items-center text-theme-8/80 hover:text-theme-10/80 tlg:hover:text-theme-8/80 dark:text-theme-7/80 hover:dark:text-theme-9/80 tlg:hover:dark:text-theme-7/80 mt-[2px] ml-px group">
                                                    {/* <svg className="w-[10px] mr-[6px] fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"/></svg> */}
                                                    <svg className="w-[14px] mr-[4px] fill-theme-8/80 group-hover:fill-theme-10/80 tlg:group-hover:fill-theme-8/80 dark:fill-theme-7/80 group-hover:dark:fill-theme-9/80 tlg:group-hover:dark:fill-theme-7/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/></svg>
                                                    유저 관리
                                                </a>
                                            </> : <></>
                                        }
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
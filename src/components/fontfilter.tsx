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

export default function FontFilter (
    {
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
            <div className="w-[100%] mt-[60px] tlg:mt-[52px]">
                <div className="flex items-center pt-[32px]">
                    <h2 className="text-[22px] text-theme-3 dark:text-theme-9 font-bold">폰트 보기</h2>
                    <h3 className="text-[14px] text-theme-5 dark:text-theme-7 ml-[12px]">모든 상업용 무료 폰트</h3>
                </div>
                <div className='interface w-[100%] pt-[12px] relative z-10 flex flex-row justify-between items-center'>
                    <div className="tlg:w-[100%] flex flex-row justify-start items-center">
                        <div className="group w-content relative tlg:hidden mr-[12px]">
                            <input onChange={handleSearch} type="text" placeholder="폰트, 회사명을 검색해 보세요..." defaultValue={source} className="w-[280px] txl:w-[200px] text-[14px] text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-4 px-[20px] py-[10px] pl-[44px] bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40"/>
                            <svg className="w-[12px] absolute left-[20px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                        </div>
                        <div className="tlg:w-[calc(100%-56px)] relative group">
                            <input onChange={handleTextChange} type='text' placeholder='원하는 문구를 적어보세요...' className="w-[280px] txl:w-[260px] tlg:w-[100%] text-[14px] tlg:text-[12px] text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-4 px-[20px] tlg:px-[16px] py-[10px] tlg:py-[8px] pl-[52px] tlg:pl-[38px] bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40 tlg:focus:bg-transparent"/>
                            <svg className="w-[16px] tlg:w-[14px] absolute left-[24px] tlg:left-[16px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                        </div>
                    </div>
                    <div className='w-content flex flex-row justify-start items-center'>
                        {
                            page === "index"
                            ? <>
                                <div className="flex flex-row justify-end items-center tlg:hidden">
                                    <div className='w-content relative flex flex-row justify-start items-center'>
                                        <input type='checkbox' id='select-lang' onChange={handleLangChange} className="select hidden"/>
                                        <label ref={refLangSelect} htmlFor='select-lang' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none tracking-normal px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-3 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] flex flex-row justify-center items-center text-inherit leading-[32px] text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                언어 선택
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refLangOption} id="option-lang" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
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
                                        <label ref={refTypeSelect} htmlFor='select-type' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] tmd:px-[12px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-3 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-10/80 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                폰트 형태
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refTypeOption} id="option-type" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
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
                                        <label ref={refSortSelect} htmlFor='select-sort' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-theme-3 dark:text-theme-8 leading-none px-[20px] tlg:px-[16px] border border-theme-7 dark:border-theme-5 rounded-full cursor-pointer fill-theme-3 dark:fill-theme-8 hover:bg-theme-3 hover:dark:bg-theme-blue-2 hover:border-theme-yellow hover:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:fill-theme-10 hover:dark:fill-theme-9 hover:drop-shadow-default hover:dark:drop-shadow-dark">
                                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px] pt-px">
                                                {sort === "like" ? "인기순" : sort === "view" ? "조회순" : sort === "date" ? "최신순" : "이름순"}
                                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                                            </button>
                                        </label>
                                        <div ref={refSortOption} id="option-sort" className='option w-[114px] tlg:w-[96px] tmd:w-[88px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-theme-yellow dark:border-theme-blue-1 rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[22px] tlg:py-[16px] tmd:py-[14px] bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-view" name="option-sort" value="view" className="option-input hidden" defaultChecked={sort === "view" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-view'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">조회순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-like" name="option-sort" value="like" className="option-input hidden" defaultChecked={sort === "like" ? true : false}/>
                                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                                <label htmlFor='option-sort-like'>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                                </label>
                                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-theme-10 dark:text-theme-9 leading-tight">인기순</span>
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
                                </div>
                            </> : <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
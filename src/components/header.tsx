// next
import Link from "next/link";
import Image from "next/image";

// next-auth
import { signOut } from "next-auth/react";

// react
import { useEffect, useRef, useState } from "react";

// libraries
import { useCookies } from "react-cookie";
import { throttle } from "lodash";

// components
import FontSearch from "./fontsearch";

// 빈 함수
const emptyFn = () => { return; }

const defaultHeader = {
    page: "",
    license: "",
    lang: "",
    type: "",
    sort: "",
    source: "",
    handleTextChange: emptyFn,
    handleLicenseOptionChange: emptyFn,
    handleLangOptionChange: emptyFn,
    handleTypeOptionChange: emptyFn,
    handleSortOptionChange: emptyFn,
    handleSearch: emptyFn,
}

interface Header {
    isMac: boolean,
    theme: string,
    user: any,
    page?: string,
    license?: string,
    lang?: string,
    type?: string,
    sort?: string,
    source?: string,
    handleTextChange?: any,
    handleLicenseOptionChange?: any,
    handleLangOptionChange?: any,
    handleTypeOptionChange?: any,
    handleSortOptionChange?: any,
    handleSearch?: any,
}

export default function Header (
    {
        isMac,
        theme,
        user,
        page=defaultHeader.page,
        license=defaultHeader.license,
        lang=defaultHeader.lang,
        type=defaultHeader.type,
        sort=defaultHeader.sort,
        source=defaultHeader.source,
        handleTextChange=defaultHeader.handleTextChange,
        handleLicenseOptionChange=defaultHeader.handleLangOptionChange,
        handleLangOptionChange=defaultHeader.handleLangOptionChange,
        handleTypeOptionChange=defaultHeader.handleTypeOptionChange,
        handleSortOptionChange=defaultHeader.handleSortOptionChange,
        handleSearch=defaultHeader.handleSearch,
    }: Header) {
    // states
    const [, setCookie] = useCookies<string>([]);
    const [thisTheme, setTheme] = useState(theme);
    const [searchDisplay, setSearchDisplay] = useState("hide");

    // refs
    const refLicenseSelect = useRef<HTMLLabelElement>(null);
    const refLicenseOption = useRef<HTMLDivElement>(null);
    const refLangSelect = useRef<HTMLLabelElement>(null);
    const refLangOption = useRef<HTMLDivElement>(null);
    const refTypeSelect = useRef<HTMLLabelElement>(null);
    const refTypeOption = useRef<HTMLDivElement>(null);
    const refSortSelect = useRef<HTMLLabelElement>(null);
    const refSortOption = useRef<HTMLDivElement>(null);
    const refAccountLabel = useRef<HTMLLabelElement>(null);
    const refAccountDiv = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 - "허용 범위" 외 영역 클릭
    useEffect(() => {
        function handleLicenseOutside(e:Event) {
            const selectInput = document.getElementById("select-license") as HTMLInputElement;
            if (refLicenseSelect?.current && !refLicenseSelect.current.contains(e.target as Node) && refLicenseOption.current && !refLicenseOption.current.contains(e.target as Node)) {
                selectInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleLicenseOutside);
        return () => document.removeEventListener("mouseup", handleLicenseOutside);
    },[refLicenseOption]);

    /** 셀렉트 박스 - "언어 선택" 클릭 */
    const handleLicenseChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const option = document.getElementById("option-license") as HTMLDivElement;
        if (e.target.checked) {
            option.classList.add("animate-fade-in");
            setTimeout(function() { option.classList.remove('animate-fade-in'); },600);
        }
    }

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

    /** 컬러 테마 변경 */
    const handleColorThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();

        if (e.target.checked) {
            expires.setMonth(expires.getMonth() + 1);
            setCookie('theme', 'dark', {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            document.documentElement.classList.add('dark');
            setTheme("dark");
        } else {
            expires.setMonth(expires.getMonth() - 1);
            setCookie('theme', 'light', {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            document.documentElement.classList.remove('dark');
            setTheme("light");
        }
    }

    // 계정 영역 외 클릭
    useEffect(() => {
        function handleAccountOutside(e: Event) {
            const account = document.getElementById("account") as HTMLInputElement;
            if (refAccountDiv?.current && !refAccountDiv.current.contains(e.target as Node) && refAccountLabel.current && !refAccountLabel.current.contains(e.target as Node)) {
                account.checked = false;
            }
        }
        document.addEventListener("mouseup", handleAccountOutside);
        return () => document.removeEventListener("mouseup", handleAccountOutside);
    },[refAccountDiv, refAccountLabel]);

    /** 계정 선택창 팝업 */
    const handleAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const accountSelect = document.getElementById("account-select") as HTMLDivElement;
        if (e.target.checked) {
            accountSelect.classList.add("animate-fade-in-account");
            setTimeout(function() { accountSelect.classList.remove('animate-fade-in-account'); },600);
        }
    }

    /** lodash/throttle을 이용해 스크롤 제어 */
    const handleScroll = () => {
        if (page === "index") {
            const inputLicense = document.getElementById("select-license") as HTMLInputElement;
            const inputLang = document.getElementById("select-lang") as HTMLInputElement;
            const inputType = document.getElementById("select-type") as HTMLInputElement;
            const inputSort = document.getElementById("select-sort") as HTMLInputElement;
            const inputAccount = document.getElementById("account") as HTMLInputElement;
            inputLicense.checked = false;
            inputLang.checked = false;
            inputType.checked = false;
            inputSort.checked = false;
            inputAccount.checked = false;
        } else {
            const inputAccount = document.getElementById("account") as HTMLInputElement;
            inputAccount.checked = false;
        }
    }
    const throttledScroll = throttle(handleScroll,500);

    // lodash/throttle을 이용해 스크롤
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

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
    const handleLogout = () => { signOut(); }

    /** 로그인 버튼 클릭 */
    const handleLoginClick = () => {
        sessionStorage.setItem('login_history', location.href);
    }

    /** 로고 클릭 시 searchword, filter 초기화 */
    const reset = () => { handleSearch(""); }

    return (
        <>
            <header className="w-full">
                <div className='interface w-full h-[60px] tlg:h-[52px] px-8 tlg:px-4 fixed right-0 top-0 z-20 flex flex-row justify-between items-center backdrop-blur bg-theme-10/80 dark:bg-theme-2/80 border-b border-theme-7 dark:border-theme-5'>
                    <div className="tlg:w-full flex flex-row justify-start items-center">
                        <Link onClick={reset} href="/" aria-label="logo" className="w-9 tlg:w-8 h-9 tlg:h-8 flex flex-row justify-center items-center rounded-lg tlg:rounded-md mr-3 bg-theme-2 dark:bg-theme-1">
                            <i className="text-lg text-theme-10 fa-solid fa-a"></i>
                        </Link>
                        {
                            page === "index"
                            ? <>
                                <div className="tlg:w-[calc(100%-56px)] relative group">
                                    <input onChange={handleTextChange} type='text' placeholder='원하는 문구를 적어보세요...' className="w-[280px] txl:w-[200px] tlg:w-full text-sm txl:text-xs text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-5 px-4 py-2.5 txl:py-2 pl-10 bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40 tlg:focus:bg-transparent"/>
                                    <i className="text-xs absolute left-5 top-1/2 -translate-y-1/2 text-theme-5 dark:text-theme-8 fa-solid fa-a"></i>
                                </div>
                            </> : <></>
                        }
                    </div>
                    <div className='w-max flex flex-row justify-start items-center'>
                        {
                            page === "index"
                            ? <>
                                <div className="flex flex-row justify-end items-center tlg:hidden">
                                <div className='w-max relative flex flex-row justify-start items-center'>
                                        <input type='checkbox' id='select-license' onChange={handleLicenseChange} className="peer hidden"/>
                                        <label ref={refLicenseSelect} htmlFor='select-license' className="group h-8 txl:h-[30px] px-5 txl:px-4 relative flex justify-center items-center text-sm leading-none border rounded-full cursor-pointer text-theme-3 peer-checked:text-theme-10 dark:text-theme-8 border-theme-7 dark:border-theme-5 hover:bg-theme-3 peer-checked:bg-theme-3 hover:dark:bg-theme-blue-2 peer-checked:dark:bg-theme-blue-2 hover:border-theme-yellow peer-checked:border-theme-yellow hover:dark:border-theme-blue-1 peer-checked:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:drop-shadow-default peer-checked:drop-shadow-default hover:dark:drop-shadow-dark peer-checked:dark:drop-shadow-dark">
                                            <div className='w-full h-full absolute z-10'></div>
                                            <button className="w-full flex justify-center items-center text-sm txl:text-xs">
                                                허용 범위
                                                <i className="ml-2 mb-0.5 peer-checked:group-[]:rotate-180 peer-checked:group-[]:mb-0 fa-solid fa-caret-down"></i>
                                            </button>
                                        </label>
                                        <div ref={refLicenseOption} id="option-license" className='hidden peer-checked:flex w-32 txl:w-[104px] absolute z-2 left-1/2 top-10 txl:top-9 -translate-x-1/2 border border-theme-yellow dark:border-theme-blue-1 rounded-lg flex-col justify-start items-start gap-1 px-4 py-3.5 txl:p-3.5 txl:py-3 bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-all" name="option-license" value="all" className="peer/all hidden" defaultChecked={license === "all" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-all' className="cursor-pointer">
                                                    <i className="block peer-checked/all:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/all:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">전체</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-print" name="option-license" value="print" className="peer/print hidden" defaultChecked={license === "print" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-print' className="cursor-pointer">
                                                    <i className="block peer-checked/print:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/print:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">인쇄물</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-web" name="option-license" value="web" className="peer/web hidden" defaultChecked={license === "web" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-web' className="cursor-pointer">
                                                    <i className="block peer-checked/web:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/web:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">웹 서비스</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-video" name="option-license" value="video" className="peer/video hidden" defaultChecked={license === "video" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-video' className="cursor-pointer">
                                                    <i className="block peer-checked/video:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/video:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">영상물</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-package" name="option-license" value="package" className="peer/package hidden" defaultChecked={license === "package" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-package' className="cursor-pointer">
                                                    <i className="block peer-checked/package:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/package:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">포장지</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-embed" name="option-license" value="embed" className="peer/embed hidden" defaultChecked={license === "embed" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-embed' className="cursor-pointer">
                                                    <i className="block peer-checked/embed:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/embed:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">임베딩</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-bici" name="option-license" value="bici" className="peer/bici hidden" defaultChecked={license === "bici" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-bici' className="cursor-pointer">
                                                    <i className="block peer-checked/bici:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/bici:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">BI/CI</span>
                                            </div>
                                            <input onChange={handleLicenseOptionChange} type='radio' id="option-license-ofl" name="option-license" value="ofl" className="peer/ofl hidden" defaultChecked={license === "ofl" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-license-ofl' className="cursor-pointer">
                                                    <i className="block peer-checked/ofl:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/ofl:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">OFL</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-max relative flex flex-row justify-start items-center ml-2 txl:ml-1'>
                                        <input type='checkbox' id='select-lang' onChange={handleLangChange} className="peer hidden"/>
                                        <label ref={refLangSelect} htmlFor='select-lang' className="group h-8 txl:h-[30px] px-5 txl:px-4 relative flex justify-center items-center text-sm leading-none border rounded-full cursor-pointer text-theme-3 peer-checked:text-theme-10 dark:text-theme-8 border-theme-7 dark:border-theme-5 hover:bg-theme-3 peer-checked:bg-theme-3 hover:dark:bg-theme-blue-2 peer-checked:dark:bg-theme-blue-2 hover:border-theme-yellow peer-checked:border-theme-yellow hover:dark:border-theme-blue-1 peer-checked:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:drop-shadow-default peer-checked:drop-shadow-default hover:dark:drop-shadow-dark peer-checked:dark:drop-shadow-dark">
                                            <div className='w-full h-full absolute z-10'></div>
                                            <button className="w-full flex justify-center items-center text-sm txl:text-xs">
                                                언어 선택
                                                <i className="ml-2 mb-0.5 peer-checked:group-[]:rotate-180 peer-checked:group-[]:mb-0 fa-solid fa-caret-down"></i>
                                            </button>
                                        </label>
                                        <div ref={refLangOption} id="option-lang" className='hidden peer-checked:flex w-32 txl:w-[104px] absolute z-2 left-1/2 top-10 txl:top-9 -translate-x-1/2 border border-theme-yellow dark:border-theme-blue-1 rounded-lg flex-col justify-start items-start gap-1 px-4 py-3.5 txl:p-3.5 txl:py-3 bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-all" name="option-lang" value="all" className="peer/all hidden" defaultChecked={lang === "all" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-lang-all' className="cursor-pointer">
                                                    <i className="block peer-checked/all:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/all:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">전체</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-kr" name="option-lang" value="kr" className="peer/kr hidden" defaultChecked={lang === "kr" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-lang-kr' className="cursor-pointer">
                                                    <i className="block peer-checked/kr:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/kr:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">한국어</span>
                                            </div>
                                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-en" name="option-lang" value="en" className="peer/en hidden" defaultChecked={lang === "en" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-lang-en' className="cursor-pointer">
                                                    <i className="block peer-checked/en:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/en:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs text-theme-10 dark:text-theme-9 leading-tight txl:pb-px">영어</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-max relative flex flex-row justify-start items-center ml-2 txl:ml-1'>
                                        <input type='checkbox' id='select-type' onChange={handleTypeChange} className="peer hidden"/>
                                        <label ref={refTypeSelect} htmlFor='select-type' className="group h-8 txl:h-[30px] px-5 txl:px-4 relative flex justify-center items-center text-sm leading-none border rounded-full cursor-pointer text-theme-3 peer-checked:text-theme-10 dark:text-theme-8 border-theme-7 dark:border-theme-5 hover:bg-theme-3 peer-checked:bg-theme-3 hover:dark:bg-theme-blue-2 peer-checked:dark:bg-theme-blue-2 hover:border-theme-yellow peer-checked:border-theme-yellow hover:dark:border-theme-blue-1 peer-checked:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:drop-shadow-default peer-checked:drop-shadow-default hover:dark:drop-shadow-dark peer-checked:dark:drop-shadow-dark">
                                            <div className='w-full h-full absolute z-10'></div>
                                            <button className="w-full flex justify-center items-center text-sm txl:text-xs">
                                                폰트 형태
                                                <i className="ml-2 mb-0.5 peer-checked:group-[]:rotate-180 peer-checked:group-[]:mb-0 fa-solid fa-caret-down"></i>
                                            </button>
                                        </label>
                                        <div ref={refTypeOption} id="option-type" className='hidden peer-checked:flex w-32 txl:w-[104px] absolute z-2 left-1/2 top-10 txl:top-9 -translate-x-1/2 border border-theme-yellow dark:border-theme-blue-1 rounded-lg flex-col justify-start items-start gap-1 px-4 py-3.5 txl:p-3.5 txl:py-3 bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-all" name="option-type" value="all" className="peer/all hidden" defaultChecked={type === "all" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-all' className="cursor-pointer">
                                                    <i className="block peer-checked/all:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/all:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">전체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-sans-serif" name="option-type" value="sans-serif" className="peer/sans-serif hidden" defaultChecked={type === "sans-serif" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-sans-serif' className="cursor-pointer">
                                                    <i className="block peer-checked/sans-serif:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/sans-serif:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">고딕</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-serif" name="option-type" value="serif" className="peer/serif hidden" defaultChecked={type === "serif" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-serif' className="cursor-pointer">
                                                    <i className="block peer-checked/serif:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/serif:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">명조</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-hand-writing" name="option-type" value="hand-writing" className="peer/hand-writing hidden" defaultChecked={type === "hand-writing" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-hand-writing' className="cursor-pointer">
                                                    <i className="block peer-checked/hand-writing:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/hand-writing:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">손글씨</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-display" name="option-type" value="display" className="peer/display hidden" defaultChecked={type === "display" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-display' className="cursor-pointer">
                                                    <i className="block peer-checked/display:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/display:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">장식체</span>
                                            </div>
                                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-pixel" name="option-type" value="pixel" className="peer/pixel hidden" defaultChecked={type === "pixel" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-type-pixel' className="cursor-pointer">
                                                    <i className="block peer-checked/pixel:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/pixel:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">픽셀체</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-max relative flex flex-row justify-start items-center ml-2 txl:ml-1'>
                                        <input type='checkbox' id='select-sort' onChange={handleSortChange} className="peer hidden"/>
                                        <label ref={refSortSelect} htmlFor='select-sort' className="group h-8 txl:h-[30px] px-5 txl:px-4 relative flex justify-center items-center text-sm leading-none border rounded-full cursor-pointer text-theme-3 peer-checked:text-theme-10 dark:text-theme-8 border-theme-7 dark:border-theme-5 hover:bg-theme-3 peer-checked:bg-theme-3 hover:dark:bg-theme-blue-2 peer-checked:dark:bg-theme-blue-2 hover:border-theme-yellow peer-checked:border-theme-yellow hover:dark:border-theme-blue-1 peer-checked:dark:border-theme-blue-1 hover:text-theme-10 hover:dark:text-theme-9 hover:drop-shadow-default peer-checked:drop-shadow-default hover:dark:drop-shadow-dark peer-checked:dark:drop-shadow-dark">
                                            <div className='w-full h-full absolute z-10'></div>
                                            <button className="w-full flex justify-center items-center text-sm txl:text-xs">
                                                {sort === "like" ? "인기순" : sort === "view" ? "조회순" : sort === "date" ? "최신순" : "이름순"}
                                                <i className="ml-2 mb-0.5 peer-checked:group-[]:rotate-180 peer-checked:group-[]:mb-0 fa-solid fa-caret-down"></i>
                                            </button>
                                        </label>
                                        <div ref={refSortOption} id="option-sort" className='hidden peer-checked:flex w-28 txl:w-[100px] absolute z-2 left-1/2 top-10 txl:top-9 -translate-x-1/2 border border-theme-yellow dark:border-theme-blue-1 rounded-lg flex-col justify-start items-start gap-1 px-4 py-3.5 txl:p-3.5 txl:py-3 bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark'>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-view" name="option-sort" value="view" className="peer/view hidden" defaultChecked={sort === "view" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-sort-view' className="cursor-pointer">
                                                    <i className="block peer-checked/view:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/view:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">조회순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-like" name="option-sort" value="like" className="peer/like hidden" defaultChecked={sort === "like" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-sort-like' className="cursor-pointer">
                                                    <i className="block peer-checked/like:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/like:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">인기순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-latest" name="option-sort" value="date" className="peer/date hidden" defaultChecked={sort === "date" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-sort-latest' className="cursor-pointer">
                                                    <i className="block peer-checked/date:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/date:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">최신순</span>
                                            </div>
                                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-name" name="option-sort" value="name" className="peer-checked/name hidden" defaultChecked={sort === "name" ? true : false}/>
                                            <div className='group flex justify-start items-center'>
                                                <label htmlFor='option-sort-name' className="cursor-pointer">
                                                    <i className="block peer-checked/name:group-[]:hidden text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                                    <i className="hidden peer-checked/name:group-[]:block text-lg txl:text-base mr-2.5 txl:mr-2 text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                                </label>
                                                <span className="text-sm txl:text-xs txl:pb-px text-theme-10 dark:text-theme-9 leading-tight">이름순</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-px h-5 tlg:h-4 rounded-full mx-2.5 tlg:mx-2 bg-theme-7 dark:bg-theme-5'></div>
                                </div>
                                <div className="group w-max relative tlg:hidden">
                                    <input onChange={handleSearch} type="text" placeholder="폰트, 회사명을 검색해 보세요..." defaultValue={source} className="w-[280px] txl:w-[200px] tlg:w-full text-sm txl:text-xs text-normal placeholder-theme-5 dark:placeholder-theme-6 text-theme-5 dark:text-theme-8 leading-none border rounded-full border-theme-7 dark:border-theme-5 px-4 py-2.5 txl:py-2 pl-10 bg-transparent group-hover:dark:bg-theme-3/40 tlg:group-hover:bg-transparent focus:dark:bg-theme-3/40 tlg:focus:bg-transparent"/>
                                    <i className="text-xs absolute left-5 top-1/2 -translate-y-1/2 text-theme-5 dark:text-theme-8 fa-solid fa-magnifying-glass"></i>
                                </div>
                            </> : <></>
                        }
                        <button onClick={handleFontSearch} className={`${page === "index" ? "hidden tlg:flex" : "flex"} w-[220px] tlg:w-[200px] tmd:w-8 h-8 tlg:h-[30px] relative text-sm tlg:text-xs text-normal text-theme-4 dark:text-theme-9 leading-none bg-theme-8 dark:bg-theme-3 flex-start justify-start items-center rounded-lg tmd:rounded-md pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-3 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none`}>
                            <span className="tmd:hidden mt-px">폰트 검색하기...</span>
                            <i className="text-xs absolute left-3.5 tlg:left-3 tmd:left-1/2 top-1/2 tmd:-translate-x-1/2 -translate-y-1/2 text-theme-4 dark:text-theme-9 fa-solid fa-magnifying-glass"></i>
                            <div className="w-max h-full absolute right-4 flex flex-row justify-center items-center">
                                {
                                    isMac === true
                                    ? <div className="flex flex-row justify-center items-center">
                                        <svg className="tmd:hidden w-[11px] fill-theme-4 dark:fill-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                        <span className="tmd:hidden text-xs leading-none pt-px">K</span>
                                    </div>
                                    : ( isMac === false
                                        ? <span className="tmd:hidden mt-px text-xs leading-none">Ctrl + K</span>
                                        : <></>
                                    )
                                }
                            </div>
                        </button>
                        <div className='w-px h-5 tlg:h-4 rounded-full mx-2.5 tlg:mx-2 mr-1.5 tlg:mr-1 bg-theme-7 dark:bg-theme-5'></div>
                        <div className="relative mx-2">
                            <label htmlFor="color-theme" className="w-7 h-7 flex flex-row justify-center items-center cursor-pointer">
                                <input onChange={handleColorThemeChange} defaultChecked={thisTheme === 'dark' ? true : false} type="checkbox" id="color-theme" className="hidden peer"/>
                                <i className='block peer-checked:hidden text-theme-yellow text-lg fa-solid fa-cloud-sun'></i>
                                <i className='hidden peer-checked:block text-theme-blue-1 text-lg fa-solid fa-cloud-moon'></i>
                            </label>
                        </div>
                        <div className="relative flex flex-row justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="peer hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" className="w-8 h-8 flex justify-center items-center cursor-pointer text-theme-3 hover:text-theme-5 peer-checked:text-theme-5 tlg:hover:text-theme-3 dark:text-theme-9 hover:dark:text-theme-7 peer-checked:dark:text-theme-7 tlg:hover:dark:text-theme-9">
                                {
                                    user === null
                                    ? <i className="text-2xl fa-regular fa-face-smile"></i>
                                    : <div className="w-7 h-7 relative">
                                        <Image src={user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover rounded-full"/>
                                    </div>
                                }
                            </label>
                            <div ref={refAccountDiv} id="account-select" className="hidden peer-checked:block w-[136px] absolute right-0 top-10 rounded-lg px-4 py-3 bg-theme-3 dark:bg-theme-blue-2 drop-shadow-default dark:drop-shadow-dark cursor-default">
                                <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="flex justify-start items-center text-theme-10/80 hover:text-theme-10 tlg:hover:text-theme-10/80">
                                    <i className="text-sm fa-brands fa-github"></i>
                                    <span className="text-[13px] ml-1.5">깃허브</span>
                                </Link>
                                <Link href="/notices" className="flex justify-start items-center mt-1 text-theme-10/80 hover:text-theme-10 tlg:hover:text-theme-10/80">
                                    <i className="text-[13px] ml-px fa-regular fa-flag"></i>
                                    <span className="text-[13px] ml-[7px]">공지사항</span>
                                </Link>
                                <Link href="/issue/font" className="flex justify-start items-center mt-1 text-theme-10/80 hover:text-theme-10 tlg:hover:text-theme-10/80">
                                    <i className="text-xs ml-px text-theme-yellow fa-solid fa-bullhorn"></i>
                                    <span className="text-[13px] ml-[7px]">폰트 제보하기</span>
                                </Link>
                                <Link href="/issue/bug" className="flex justify-start items-center mt-1 text-theme-10/80 hover:text-theme-10 tlg:hover:text-theme-10/80">
                                    <i className="text-[13px] ml-px text-theme-red fa-solid fa-bug"></i>
                                    <span className="text-[13px] ml-[7px]">버그 리포트</span>
                                </Link>
                                {
                                    user === null
                                    ? <>
                                        <Link href="/user/login" onClick={handleLoginClick} className="w-full h-7 flex justify-center items-center rounded-lg mt-2.5 bg-theme-yellow/90 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/90 dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/90">
                                            <span className="text-sm text-theme-3 dark:text-theme-blue-2 font-medium mt-px">로그인</span>
                                        </Link>
                                    </> : <div className="text-sm text-theme-7">
                                        <div className="w-full h-px bg-theme-7 my-2.5"></div>
                                        <div className="text-theme-10">{user.name}<span className="text-theme-7"> 님,</span></div>
                                        <Link href="/user/info" className="flex justify-start items-centerå mt-1.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                            <i className="text-xs mr-1 fa-solid fa-user-lock"></i>
                                            프로필 정보
                                        </Link>
                                        <Link onClick={reset} href="/?filter=liked" className="flex justify-start items-center mt-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                            <i className="text-sm mr-1.5 fa-regular fa-heart"></i>
                                            좋아요 목록
                                        </Link>
                                        <Link href="/user/comments" className="flex justify-start items-center mt-0.5 ml-px hover:text-theme-10 tlg:hover:text-theme-7">
                                            <i className="text-[13px] mr-1.5 fa-regular fa-comment"></i>
                                            댓글 목록
                                        </Link>
                                        {
                                            user.id === 1
                                            ? <>
                                                <div className="w-full h-px bg-theme-7 my-2.5"></div>
                                                <div className="text-theme-10">관리자<span className="text-theme-7"> 기능</span></div>
                                                <Link href="/admin/font/list" className="flex justify-start items-center mt-1.5 ml-px hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-sm mr-2 fa-solid fa-a"></i>
                                                    폰트 목록
                                                </Link>
                                                <Link href="/admin/font/add" className="flex justify-start items-center mt-0.5 ml-px hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-sm mr-2 fa-solid fa-a"></i>
                                                    폰트 추가
                                                </Link>
                                                <Link href="/admin/font/edit" className="flex justify-start items-center mt-0.5 ml-px hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-sm mr-2 fa-solid fa-a"></i>
                                                    폰트 수정
                                                </Link>
                                                <Link href="/admin/user/list" className="flex justify-start items-center mt-0.5 ml-px hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1 fa-solid fa-user-lock"></i>
                                                    유저 목록
                                                </Link>
                                                <Link href="/admin/comment/list" className="flex justify-start items-center mt-0.5 ml-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1.5 fa-regular fa-comment"></i>
                                                    댓글 목록
                                                </Link>
                                                <Link href="/admin/issue/list" className="flex justify-start items-center mt-0.5 ml-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1.5 fa-regular fa-paper-plane"></i>
                                                    폰트 제보
                                                </Link>
                                                <Link href="/admin/bug/list" className="flex justify-start items-center mt-0.5 ml-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1.5 fa-regular fa-paper-plane"></i>
                                                    버그 제보
                                                </Link>
                                                <Link href="/admin/notices/add" className="flex justify-start items-center mt-0.5 ml-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1.5 ml-px fa-regular fa-flag"></i>
                                                    공지 추가
                                                </Link>
                                                <Link href="/admin/notices/list" className="flex justify-start items-center ml-0.5 hover:text-theme-10 tlg:hover:text-theme-7">
                                                    <i className="text-xs mr-1.5 ml-px fa-regular fa-flag"></i>
                                                    공지 목록
                                                </Link>
                                            </> : <></>
                                        }
                                        <button onClick={handleLogout} className="w-full h-7 flex flex-row justify-center items-center rounded-lg mt-3 bg-theme-yellow/90 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/90 dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/90">
                                            <span className="text-theme-3 dark:text-theme-blue-2 font-medium mt-px">로그아웃</span>
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
// 훅
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { throttle } from "lodash";
import { isMacOs } from "react-device-detect";

// 컴포넌트
import Tooltip from "@/components/tooltip";
import FontBox from "@/components/fontbox";
import FontSearch from "@/components/fontsearch";

const Index = ({params}: any) => {
    /** useRouter 훅 */
    const router = useRouter();

    /** 셀렉트 박스 - "언어 선택" 영역 */
    const refLangSelect = useRef<HTMLLabelElement>(null);
    const refLangOption = useRef<HTMLDivElement>(null);

    /** 셀렉트 박스 - "언어 선택" 외 영역 클릭 */
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

    /** 셀렉트 박스 - "폰트 형태" 영역 */
    const refTypeSelect = useRef<HTMLLabelElement>(null);
    const refTypeOption = useRef<HTMLDivElement>(null);

    /** 셀렉트 박스 - "폰트 형태" 외 영역 클릭 */
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

    /** 셀렉트 박스 - "정렬순" 영역 */
    const refSortSelect = useRef<HTMLLabelElement>(null);
    const refSortOption = useRef<HTMLDivElement>(null);

    /** 셀렉트 박스 - 정렬순" 외 영역 클릭 */
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

    /** 옵션 - "언어 선택" 훅 */
    const defaultLang: string = params.lang;
    const [lang, setLang] = useState(defaultLang);
    useEffect(() => { setLang(defaultLang);},[defaultLang]);

    /** 옵션 - "언어 선택" 클릭 */
    const handleLangOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            if (e.target.value === "all") {
                if (type === "all" && sort === "date") {
                    router.push({ pathname: '/'}).then(() => router.reload());
                }
                else if (type !== "all" && sort === "date") {
                    router.push({ pathname: '/', query: { type: type }}).then(() => router.reload());
                }
                else if (type === "all" && sort !== "date") {
                    router.push({ pathname: '/', query: { sort: sort }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { type: type, sort: sort }}).then(() => router.reload());
                }
            }
            else {
                if (type === "all" && sort === "date") {
                    router.push({ pathname: '/', query: { lang: e.target.value }}).then(() => router.reload());
                }
                else if (type !== "all" && sort === "date") {
                    router.push({ pathname: '/', query: { lang: e.target.value, type: type }}).then(() => router.reload());
                }
                else if (type === "all" && sort !== "date") {
                    router.push({ pathname: '/', query: { lang: e.target.value, sort: sort }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { lang: e.target.value, type: type, sort: sort }}).then(() => router.reload());
                }   
            }
        }
    }

    /** 옵션 - "폰트 형태" 훅 */
    const defaultType: string = params.type;
    const [type, setType] = useState(defaultType);
    useEffect(() => { setType(defaultType);},[defaultType]);

    /** 옵션 - "폰트 형태" 클릭 */
    const handleTypeOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            if (e.target.value === "all") {
                if (lang === "all" && sort === "date") {
                    router.push({ pathname: '/'}).then(() => router.reload());
                }
                else if (lang !== "all" && sort === "date") {
                    router.push({ pathname: '/', query: { lang: lang }}).then(() => router.reload());
                }
                else if (lang === "all" && sort !== "date") {
                    router.push({ pathname: '/', query: { sort: sort }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { lang: lang, sort: sort }}).then(() => router.reload());
                }
            }
            else {
                if (lang === "all" && sort === "date") {
                    router.push({ pathname: '/', query: { type: e.target.value }}).then(() => router.reload());
                }
                else if (lang !== "all" && sort === "date") {
                    router.push({ pathname: '/', query: { lang: lang, type: e.target.value }}).then(() => router.reload());
                }
                else if (lang === "all" && sort !== "date") {
                    router.push({ pathname: '/', query: { type: e.target.value, sort: sort }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { lang: lang, type: e.target.value, sort: sort }}).then(() => router.reload());
                }
            }
        }
    }

    /** 옵션 - "정렬순" 훅 */
    const defaultSort: string = params.sort;
    const [sort, setSort] = useState(defaultSort);
    useEffect(() => { setSort(defaultSort);},[defaultSort]);

    /** 옵션 - "정렬순" 클릭 */
    const handleSortOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            if (e.target.value === "date") {
                if (lang === "all" && type === "all") {
                    router.push({ pathname: '/'}).then(() => router.reload());
                }
                else if (lang !== "all" && type === "all") {
                    router.push({ pathname: '/', query: { lang: lang }}).then(() => router.reload());
                }
                else if (lang === "all" && type !== "all") {
                    router.push({ pathname: '/', query: { type: type }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { lang: lang, type: type }}).then(() => router.reload());
                }
            }
            else {
                if (lang === "all" && type === "all") {
                    router.push({ pathname: '/', query: { sort: e.target.value }}).then(() => router.reload());
                }
                else if (lang !== "all" && type === "all") {
                    router.push({ pathname: '/', query: { lang: lang, sort: e.target.value }}).then(() => router.reload());
                }
                else if (lang === "all" && type !== "all") {
                    router.push({ pathname: '/', query: { type: type, sort: e.target.value }}).then(() => router.reload());
                }
                else {
                    router.push({ pathname: '/', query: { lang: lang, type: type, sort: e.target.value }}).then(() => router.reload());
                }   
            }
        }
    }

    /** 텍스트 입력칸 훅 */
    const [text, setText] = useState("");
    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

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

    /** lodash/throttle을 이용해 스크롤 제어 */
    const handleScroll = () => {
        const inputLang = document.getElementById("select-lang") as HTMLInputElement;
        const inputType = document.getElementById("select-type") as HTMLInputElement;
        const inputSort = document.getElementById("select-sort") as HTMLInputElement;
        inputLang.checked = false;
        inputType.checked = false;
        inputSort.checked = false;
    }
    const throttledScroll = throttle(handleScroll,500);

    /** 로고 클릭 시 새로고침 */
    const handleLogo = () => { router.push({ pathname: '/' }).then(() => router.reload()); }

    /** lodash/throttle을 이용해 스크롤 */
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    return (
        <>
            <Tooltip/>
            {/* 헤더 */}
            <div className='interface w-[100%] h-[60px] tlg:h-auto px-[16px] tlg:px-0 fixed right-0 top-0 z-10 flex flex-row tlg:flex-col justify-between tlg:justify-center items-center tlg:items-start backdrop-blur bg-blur-theme border-b border-dark-theme-4'>
                <div className="tlg:w-[100%] tlg:px-[12px] tlg:py-[12px] tmd:py-[10px] tlg:border-b tlg:border-dark-theme-4 flex flex-row justify-start items-center">
                    <Link onClick={handleLogo} href="/" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <svg className="w-[18px] tlg:w-[16px] pb-px fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </Link>
                    <div className="tlg:w-[calc(100%-44px)] relative group">
                        <input onChange={handleTextChange} type='text' placeholder='원하는 문구를 적어보세요...' className="w-[400px] txl:w-[300px] tlg:w-[100%] text-[14px] tlg:text-[12px] text-normal text-dark-theme-8 leading-none border rounded-full border-dark-theme-4 px-[20px] tlg:px-[16px] py-[10px] tlg:py-[8px] pl-[52px] tlg:pl-[38px] bg-transparent group-hover:bg-dark-theme-3/40 focus:bg-dark-theme-3/40"/>
                        <svg className="w-[16px] tlg:w-[14px] absolute left-[24px] tlg:left-[16px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </div>
                </div>
                <div className='tlg:w-[100%] tlg:px-[12px] tlg:py-[12px] tmd:py-[10px] w-content flex flex-row justify-start items-center'>
                    <div className='w-content relative flex flex-row justify-start items-center'>
                        <input type='checkbox' id='select-lang' onChange={handleLangChange} className="select hidden"/>
                        <label ref={refLangSelect} htmlFor='select-lang' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-dark-theme-8 leading-none px-[20px] tlg:px-[16px] tmd:px-[12px] border border-dark-theme-5 rounded-full cursor-pointer fill-dark-theme-8 hover:bg-blue-theme-bg hover:border-blue-theme-border hover:text-dark-theme-9 hover:fill-dark-theme-9 hover:drop-shadow-default">
                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px]">
                                언어 선택
                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </button>
                        </label>
                        <div ref={refLangOption} id="option-lang" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-blue-theme-border rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-blue-theme-bg drop-shadow-default'>
                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-all" name="option-lang" value="all" className="option-input hidden" defaultChecked={lang === "all" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-lang-all'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] text-dark-theme-9 leading-tight tlg:pb-px">전체</span>
                            </div>
                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-kr" name="option-lang" value="kr" className="option-input hidden" defaultChecked={lang === "kr" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-lang-kr'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] text-dark-theme-9 leading-tight tlg:pb-px">한국어</span>
                            </div>
                            <input onChange={handleLangOptionChange} type='radio' id="option-lang-en" name="option-lang" value="en" className="option-input hidden" defaultChecked={lang === "en" ? true : false}/>
                            <div className='flex flex-row justify-start items-center'>
                                <label htmlFor='option-lang-en'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] text-dark-theme-9 leading-tight tlg:pb-px">영어</span>
                            </div>
                        </div>
                    </div>
                    <div className='w-content relative flex flex-row justify-start items-center ml-[8px]'>
                        <input type='checkbox' id='select-type' onChange={handleTypeChange} className="select hidden"/>
                        <label ref={refTypeSelect} htmlFor='select-type' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-dark-theme-8 leading-none px-[20px] tlg:px-[16px] tmd:px-[12px] border border-dark-theme-5 rounded-full cursor-pointer fill-dark-theme-8 hover:bg-blue-theme-bg hover:border-blue-theme-border hover:text-dark-theme-9 hover:fill-dark-theme-9 hover:drop-shadow-default">
                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px]">
                                폰트 형태
                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </button>
                        </label>
                        <div ref={refTypeOption} id="option-type" className='option w-[128px] tlg:w-[108px] tmd:w-[92px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-blue-theme-border rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[20px] tmd:py-[14px] tlg:py-[16px] bg-blue-theme-bg drop-shadow-default'>
                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-all" name="option-type" value="all" className="option-input hidden" defaultChecked={type === "all" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-type-all'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">전체</span>
                            </div>
                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-sans-serif" name="option-type" value="sans-serif" className="option-input hidden" defaultChecked={type === "sans-serif" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-type-sans-serif'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">고딕</span>
                            </div>
                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-serif" name="option-type" value="serif" className="option-input hidden" defaultChecked={type === "serif" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-type-serif'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">명조</span>
                            </div>
                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-hand-writing" name="option-type" value="hand-writing" className="option-input hidden" defaultChecked={type === "hand-writing" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-type-hand-writing'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">손글씨</span>
                            </div>
                            <input onChange={handleTypeOptionChange} type='radio' id="option-type-display" name="option-type" value="display" className="option-input hidden" defaultChecked={type === "display" ? true : false}/>
                            <div className='flex flex-row justify-start items-center'>
                                <label htmlFor='option-type-display'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">장식체</span>
                            </div>
                        </div>
                    </div>
                    <div className='w-px h-[20px] tlg:h-[16px] tmd:hidden rounded-full mx-[10px] tlg:mx-[8px] bg-dark-theme-4'></div>
                    <div className='w-content relative flex flex-row justify-start items-center tmd:ml-[8px]'>
                        <input type='checkbox' id='select-sort' onChange={handleSortChange} className="select hidden"/>
                        <label ref={refSortSelect} htmlFor='select-sort' className="h-[32px] tlg:h-[30px] tmd:h-[28px] relative flex flex-row justify-center items-center text-[14px] text-dark-theme-8 leading-none px-[20px] tlg:px-[16px] border border-dark-theme-5 rounded-full cursor-pointer fill-dark-theme-8 hover:bg-blue-theme-bg hover:border-blue-theme-border hover:text-dark-theme-9 hover:fill-dark-theme-9 hover:drop-shadow-default">
                            <div className='w-[100%] h-[100%] absolute z-10'></div>
                            <button className="w-[100%] h-[100%] flex flex-row justify-center items-center text-inherit leading-none text-[14px] tlg:text-[12px] tmd:text-[10px]">
                                {sort === "date" ? "최신순" : "이름순"}
                                <svg className="w-[8px] tlg:w-[6px] rotate-180 ml-[12px] tlg:ml-[8px] fill-inherit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </button>
                        </label>
                        <div ref={refSortOption} id="option-sort" className='option w-[114px] tlg:w-[96px] tmd:w-[88px] absolute z-2 left-[50%] top-[40px] tlg:top-[36px] tmd:top-[34px] translate-x-[-50%] border border-blue-theme-border rounded-[12px] flex flex-col justify-start items-start px-[16px] tlg:px-[14px] tmd:px-[12px] py-[22px] tlg:py-[16px] tmd:py-[14px] bg-blue-theme-bg drop-shadow-default'>
                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-latest" name="option-sort" value="date" className="option-input hidden" defaultChecked={sort === "date" ? true : false}/>
                            <div className='flex flex-row justify-start items-center mb-[16px] tlg:mb-[10px]'>
                                <label htmlFor='option-sort-latest'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">최신순</span>
                            </div>
                            <input onChange={handleSortOptionChange} type='radio' id="option-sort-name" name="option-sort" value="name" className="option-input hidden" defaultChecked={sort === "name" ? true : false}/>
                            <div className='flex flex-row justify-start items-center'>
                                <label htmlFor='option-sort-name'>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                    <svg className='w-[18px] tlg:w-[14px] mr-[10px] tlg:mr-[8px] cursor-pointer fill-blue-theme-border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                </label>
                                <span className="text-[14px] tlg:text-[12px] tlg:pb-px text-dark-theme-9 leading-tight">이름순</span>
                            </div>
                        </div>
                    </div>
                    <div className='w-px h-[20px] tlg:h-[16px] rounded-full mx-[10px] tlg:mx-[8px] bg-dark-theme-4'></div>
                    <button onClick={handleFontSearch} className="w-[220px] tlg:w-[200px] tmd:w-[34px] h-[32px] tlg:h-[30px] relative text-[14px] tlg:text-[12px] text-normal text-dark-theme-8 leading-none bg-dark-theme-3/80 flex flex-start justify-start items-center rounded-[8px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <span className="tmd:hidden">폰트 검색하기...</span>
                        <svg className="w-[12px] tlg:w-[10px] absolute left-[16px] tlg:left-[12px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                        <div className="absolute right-[16px] flex flex-row justify-center items-center">
                            {
                                isMacOs
                                ? <div className="flex flex-row justify-center items-center">
                                    <svg className="w-[12px] fill-dark-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                    <span className="text-[12px]">K</span>
                                </div>
                                : <span className="tmd:hidden text-[12px] tlg:text-[10px] leading-none">Ctrl + K</span>
                            }
                        </div>
                    </button>
                </div>
            </div>
            {/* 메인 */}
            <FontBox lang={lang} type={type} sort={sort} text={text}/>

            {/* 폰트 검색 */}
            <FontSearch display={searchDisplay} closeBtn={handleFontSearchCloseBtn} showBtn={handleFontSearch}/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        /** 쿼리 스트링 가져오기 */
        const thisQuery = ctx.query;
        const lang = thisQuery.lang === "" || thisQuery.lang === undefined ? "all" : (thisQuery.lang === "kr" ? "kr" : (thisQuery.lang === "en" ? "en" : "all"));
        const type = thisQuery.type === "" || thisQuery.type === undefined ? "all" : (thisQuery.type === "sans-serif" ? "sans-serif" : (thisQuery.type === "serif" ? "serif" : (thisQuery.type === "hand-writing" ? "hand-writing" : (thisQuery.type === "display" ? "display" : "all"))));
        const sort = thisQuery.sort === "" || thisQuery.sort === undefined ? "date" : (thisQuery.sort === "name" ? "name" : "date");

        return {
            props: {
                params: {
                    sort: sort,
                    lang: lang,
                    type: type,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        return { props: {} }
    }
}

export default Index;
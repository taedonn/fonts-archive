// react hooks
import React, { useEffect, useRef } from "react";

export default function Filter (
    {
        display, 
        closeBtn, 
        handleLangOptionChange,
        handleTypeOptionChange,
        handleSortOptionChange,
    }:
    {
        display: string, 
        closeBtn: any, 
        handleLangOptionChange: any,
        handleTypeOptionChange: any,
        handleSortOptionChange: any,
    }
) {
    /** 취소 버튼 클릭 */
    const handleCloseBtn = () => { closeBtn(); }

    // 검색 영역 외 클릭 시
    const refSearchOutside = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 - "필터링" 외 영역 클릭
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) { closeBtn(); }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[closeBtn, refSearchOutside]);

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

    return (
        <>
            {
                display === "show"
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-center items-center backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={refSearchOutside} className="w-[360px] px-[20px] py-[20px] rounded-[12px] border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <h2 className="text-[16px] text-theme-3 dark:text-theme-8 font-bold mb-[16px]">검색 필터</h2>
                        <div className="w-[100%] text-[14px] text-theme-5 dark:text-theme-6">
                            <div className="flex flex-row justify-between items-center">
                                <h3 className="">언어 선택</h3>
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
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}
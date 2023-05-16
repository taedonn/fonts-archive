// 훅
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import axios from "axios";
import { debounce } from "lodash";
import { isMacOs } from "react-device-detect";

export default function FontSearch({display, closeBtn, showBtn}:{display: string, closeBtn: any, showBtn: any}) {
    /** 키 다운 이벤트 */
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (isMacOs) {
                if (keys["Meta"] && keys["k"]) { showBtn(); e.preventDefault(); }
                if (keys["Escape"]) { closeBtn(); }
            } else {
                if (keys["Control"] && keys["k"]) { showBtn(); e.preventDefault(); }
                if (keys["Escape"]) { closeBtn(); }
            }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    }, [showBtn, closeBtn]);

    /** esc 버튼 클릭 */
    const handleCloseBtn = () => { closeBtn(); }

    /** showBtn, closeBtn 함수가 실행될 때 keyword를 빈칸으로 변경 */
    useEffect(() => { setKeyword(""); }, [showBtn, closeBtn]);

    /** 검색 영역 외 클릭 시 */
    const refSearchOutside = useRef<HTMLDivElement>(null);

    /** 셀렉트 박스 - "언어 선택" 외 영역 클릭 */
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) { closeBtn(); }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[closeBtn, refSearchOutside]);

    /** 검색 키워드 */
    const [keyword, setKeyword] = useState<string>("");

    /** useQuery를 이용한 데이터 파싱 */
    const {isLoading, isRefetching, isSuccess, data, refetch} = useQuery(['font-search'], () => axios.get("/api/fontsearch", {params: {keyword: keyword}}).then((res) => {return res.data}));
    
    /** lodash/debounce가 적용된 검색 기능 */
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }
    const debouncedSearch = debounce((e) => { setKeyword(e.target.value); }, 500);

    /** 검색 키워드가 변경되면 refetch */
    useEffect(() => { refetch(); }, [keyword, refetch]);

    /** 검색 결과 클릭 시 창 닫기 */
    const handleLinkClick = () => { closeBtn(); }

    /** 검색 결과 마우스 오버 시 active */
    const [activeEl, setActiveEl] = useState<string | null>(null);
    const handleLinkMouseOver = (idx: number) => {
        setActiveEl("link"+idx);
    }

    return (
        <>
            {
                display === "show"
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme border-dark-theme-4">
                    <div ref={refSearchOutside} className="w-[720px] tmd:w-[calc(100%-24px)] rounded-[12px] border border-dark-theme-3 bg-dark-theme-2">
                        <div className="w-[100%] h-[56px] tmd:h-[44px] relative flex flex-row justify-center items-center border-b border-dark-theme-3">
                        <svg className="w-[16px] tmd:w-[12px] absolute left-[24px] tmd:left-[16px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                            <input onChange={handleSearch} type="text" placeholder="폰트 검색하기..." autoFocus className="w-[calc(100%-108px)] tmd:w-[calc(100%-84px)] h-[100%] text-[14px] tmd:text-[12px] leading-none text-dark-theme-8 bg-transparent"/>
                            <button onClick={handleCloseBtn} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-dark-theme-8 bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">ESC</button>
                        </div>
                        <div className="search-list w-[100%] min-h-[150px] tmd:min-h-[120px] max-h-[500px] relative overflow-auto">
                            {/* 로딩 바 */}
                            {isLoading ? <div className="w-[100%] h-[100%] absolute left-0 top-0 flex flex-row justify-center items-center"><span className="loader"></span></div> : <></>}
                            {isRefetching ? <div className="w-[100%] h-[100%] absolute left-0 top-0 flex flex-row justify-center items-center"><span className="loader"></span></div> : <></>}

                            {/* 검색 결과 */}
                            {isSuccess && !isLoading && !isRefetching
                                ? ( data.fonts.length !== 0
                                    ? <div className="w-[100%] px-[24px] tmd:px-[16px]">
                                        <div className="text-[18px] tmd:text-[14px] text-dark-theme-8 leading-none mt-[28px] tmd:mt-[24px] mb-[16px] tmd:mb-[12px] font-bold">검색 결과</div>
                                        {data && data.fonts.map((font: {
                                            code: number,
                                            name: string,
                                            source: string,
                                            font_family: string,
                                        }, idx: number) => {
                                            const elementProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};
                                            if (idx === 0 && activeEl === null) { elementProps.id = "active" }

                                            return (
                                                <Link onClick={handleLinkClick} onMouseOver={() => handleLinkMouseOver(idx)} {...elementProps} href={`/DetailPage/${font.code}`} key={font.code} className={activeEl === "link"+idx ? "active search-link w-[100%] h-[60px] tmd:h-[48px] relative px-[16px] mt-[8px] flex flex-row justify-start items-center rounded-[8px] bg-dark-theme-3/80 group" : "search-link w-[100%] h-[60px] tmd:h-[48px] relative px-[16px] mt-[8px] flex flex-row justify-start items-center rounded-[8px] bg-dark-theme-3/80 group"}>
                                                    <div className="w-[24px] tmd:w-[20px] h-[24px] tmd:h-[20px] border rounded-[6px] tmd:rounded-[4px] flex flex-row justify-center items-center mr-[12px] bg-dark-theme-4 border-dark-theme-4 when-active-1">
                                                        <svg className="w-[18px] tmd:w-[14px] fill-dark-theme-6 when-active-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/></svg>
                                                    </div>
                                                    <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 font-medium leading-none when-active-3">{font.name}</div>
                                                    <div className="text-[14px] text-dark-theme-6 font-normal leading-none tmd:hidden ml-[10px] when-active-4">{font.font_family}</div>
                                                    <div className="text-[12px] text-dark-theme-6 leading-none tmd:hidden ml-[10px] when-active-5">{font.source}</div>
                                                    <svg className="w-[12px] tmd:w-[10px] absolute right-[12px] fill-dark-theme-6 when-active-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    : ( data.fonts.length === 0 && keyword !== ""
                                        ? <div className="w-[100%] h-[100%] absolute left-0 top-0 flex flex-row justify-center items-center text-[16px] tmd:text-[12px] leading-none text-dark-theme-7">&quot;<span className="text-dark-theme-9 font-medium">{keyword}</span>&quot; 에 대한 검색 결과가 없습니다.</div>
                                        : <div className="w-[100%] h-[100%] absolute left-0 top-0 flex flex-row justify-center items-center text-[16px] tmd:text-[12px] leading-none text-dark-theme-7"><span className="text-dark-theme-9 font-medium mr-[8px]">영문/한글 폰트 이름,</span> 또는 <span className="text-dark-theme-9 font-medium ml-[8px]">회사 이름</span>을 검색해 주세요.</div>
                                    )
                                ) : <></>
                            }
                        </div>
                        <div className="w-[100%] h-[48px] flex flex-row justify-end items-center px-[24px] tmd:px-[16px] border-t text-[12px] tmd:text-[10px] text-dark-theme-5 leading-none border-dark-theme-3">© 2023. taedonn, all rights reserved.</div>
                    </div>
                </div> : <></>
            }
        </>
    )
}
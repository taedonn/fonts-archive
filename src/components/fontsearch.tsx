// react
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { debounce } from "lodash";

// next
import Link from "next/link";
import { useRouter } from "next/router";

// libraries
import axios from "axios";

export default function FontSearch(
    {
        isMac,
        display, 
        closeBtn, 
        showBtn
    }:
    {
        isMac: boolean
        display: string, 
        closeBtn: any, 
        showBtn: any
    }
) {
    const router = useRouter();

    // states
    const [keyword, setKeyword] = useState<string>("");
    const [activeEl, setActiveEl] = useState<number>(0);
    const [totalEl, setTotalEl] = useState<number>(0);
    const [isKeyDown, setIsKeyDown] = useState<boolean>(false);

    // refs
    const parentRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLAnchorElement>(null);
    const refSearchOutside = useRef<HTMLDivElement>(null);
    
    // 키 다운 이벤트
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            // 한글로 쓸 때 keydown이 두번 실행되는 현상 방지
            if (e.isComposing) return;

            keys[e.key] = true;
            // PC 환경 체크
            if (isMac) {
                if (keys["Meta"] && keys["k"]) { showBtn(); e.preventDefault(); }
                if (keys["Escape"]) { closeBtn(); }
            } else {
                if (keys["Control"] && keys["k"]) { showBtn(); e.preventDefault(); }
                if (keys["Escape"]) { closeBtn(); }
            }

            // 검색창 보임/숨김 체크
            if (keys["ArrowUp"] && display === "show") {
                // 키다운 시 isKeyDown state를 true로 변경
                setIsKeyDown(true);

                if (activeEl > 0) { setActiveEl(activeEl - 1); }
                e.preventDefault();
            }
            if (keys["ArrowDown"] && display === "show") {
                // 키다운 시 isKeyDown state를 true로 변경
                setIsKeyDown(true);

                if (activeEl < (totalEl - 1)) { setActiveEl(activeEl + 1); }
                else if (activeEl === (totalEl - 1)) { setActiveEl(0); }
                e.preventDefault();
            }

            // 엔터키 눌렀을 때 해당 페이지로 이동s
            if (keys["Enter"] && activeRef.current) { router.push(activeRef.current.href); }
        }
        const handleKeyup = (e: KeyboardEvent) => {
            keys[e.key] = false;

            // 키업 시 isKeyDown state를 false로 변경
            setIsKeyDown(false);
        }

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showBtn, closeBtn, activeEl, totalEl]);

    /** esc 버튼 클릭 */
    const handleCloseBtn = () => { closeBtn(); }

    // showBtn, closeBtn 함수가 실행될 때 keyword를 빈칸으로 변경
    useEffect(() => { setKeyword(""); }, [showBtn, closeBtn]);

    // 셀렉트 박스 - "검색 선택" 외 영역 클릭
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) { closeBtn(); }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[closeBtn, refSearchOutside]);

    // useQuery를 이용한 데이터 파싱
    const {isLoading, isRefetching, isSuccess, data, remove, refetch} = useQuery(['font-search'], async () => await axios.get("/api/fontsearch", {params: {keyword: keyword, action: "user"}}).then((res) => { return res.data }));
    
    // display가 show 상태가 아닐 시 useQuery 실행 중지
    useEffect(() => { if (display !== "show") { remove(); } }, [display, remove])

    // lodash/debounce가 적용된 검색 기능
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }
    const debouncedSearch = debounce((e) => { setKeyword(e.target.value); }, 500);

    // 검색 키워드가 변경되면 refetch
    useEffect(() => { setActiveEl(0); refetch(); }, [keyword, refetch]);

    // 검색창 닫을 때 active 링크를 0으로 리셋
    useEffect(() => { setActiveEl(0); }, [closeBtn]);

    // 검색 결과 마우스 오버 시 active
    const handleLinkMouseOver = (idx: number) => {
        if (!isKeyDown) { setActiveEl(idx); }
    }

    // 검색 결과 총 개수
    useEffect(() => { if (data !== undefined) { setTotalEl(data.fonts.length); } }, [data]);

    // active 링크가 targetElement보다 스크롤이 아래에 있을 때
    useEffect(() => {
        if (parentRef.current && activeRef.current) {
            const parent = parentRef.current.getBoundingClientRect();
            const parentBottom = parent.top + parent.height
            const active = activeRef.current.getBoundingClientRect();
            const activeBottom = active.top + active.height;
            
            if (activeBottom - parentBottom > 0) {
                parentRef.current.scrollTop = parentRef.current.scrollTop + (activeBottom - parentBottom);
            }
            else if (parent.top - active.top > 0) {
                parentRef.current.scrollTop = parentRef.current.scrollTop - (parent.top - active.top);
            }
        }
    }, [activeEl]);

    // 라우팅 끝날 때 검색창 닫기
    useEffect(() => {
        const end = () => { closeBtn(); }
        router.events.on("routeChangeComplete", end);
        return () => {
            router.events.off("routeChangeComplete", end);
        }
    }, [router, closeBtn]);

    return (
        <>
            {
                display === "show"
                ? <div className="w-full h-full fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={refSearchOutside} className="w-[720px] tmd:w-[calc(100%-24px)] rounded-lg border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="w-full h-14 tmd:h-11 relative flex flex-row justify-center items-center border-b border-theme-7 dark:border-theme-3">
                        <svg className="w-4 tmd:w-3 absolute left-6 tmd:left-4 top-1/2 -translate-y-1/2 fill-theme-4 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                            <input onChange={handleSearch} type="text" placeholder="폰트 검색하기..." autoFocus className="w-[calc(100%-108px)] tmd:w-[calc(100%-84px)] h-full text-sm tmd:text-xs leading-none text-theme-4 dark:text-theme-9 placeholder-theme-5 dark:placeholder-theme-8 bg-transparent"/>
                            <button onClick={handleCloseBtn} className="w-9 h-6 rounded-md absolute right-4 tmd:right-3 top-1/2 -translate-y-1/2 text-xs leading-none text-theme-4 dark:text-theme-9 bg-theme-8 dark:bg-theme-3 hover:dark:bg-theme-4 tlg:hover:dark:bg-theme-3 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div ref={parentRef} className="search-list w-full min-h-[150px] tmd:min-h-[120px] max-h-[500px] relative overflow-auto">
                            {/* 로딩 바 */}
                            {isLoading ? <div className="w-full h-full absolute left-0 top-0 flex flex-row justify-center items-center"><span className="loaderw-10 tlg:w-9 h-[40px] tlg:h-9"></span></div> : <></>}
                            {isRefetching ? <div className="w-full h-full absolute left-0 top-0 flex flex-row justify-center items-center"><span className="loaderw-10 tlg:w-9 h-[40px] tlg:h-9"></span></div> : <></>}

                            {/* 검색 결과 */}
                            {isSuccess && !isLoading && !isRefetching
                                ? ( data.fonts.length !== 0
                                    ? <div className="w-full px-6 tmd:px-4">
                                        <div className="text-lg tmd:text-sm text-theme-3 dark:text-theme-8 leading-none mt-7 tmd:mt-6 mb-4 tmd:mb-3 font-bold">검색 결과</div>
                                        {data && data.fonts.map((font: {
                                            code: number,
                                            name: string,
                                            source: string,
                                            font_family: string,
                                        }, idx: number) => {
                                            return (
                                                <Link aria-label="search-result-link" onMouseOver={() => handleLinkMouseOver(idx)} id={activeEl === idx ? "active" : ""} ref={activeEl === idx ? activeRef : null} href={`/post/${font.font_family.replaceAll(" ", "+")}`} key={font.code} className="search-link w-full h-[60px] tmd:h-12 relative px-4 mt-2 flex flex-row justify-start items-center rounded-lg bg-theme-8 dark:bg-theme-3 cursor-pointer">
                                                    <div className="w-6 tmd:w-5 h-6 tmd:h-5 border rounded-md tmd:rounded-sm flex flex-row justify-center items-center mr-3 bg-theme-7 dark:bg-theme-4 border-theme-7 dark:border-theme-4 when-active-1">
                                                        <svg className="w-[18px] tmd:w-3.5 fill-theme-10 dark:fill-theme-9 when-active-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/></svg>
                                                    </div>
                                                    <div className="text-sm tmd:text-xs text-theme-3 dark:text-theme-9 font-medium leading-none when-active-3">{font.name}</div>
                                                    <div className="text-sm text-theme-5 dark:text-theme-7 font-normal leading-none tmd:hidden ml-2.5 when-active-4">{font.font_family}</div>
                                                    <div className="text-xs text-theme-5 dark:text-theme-7 leading-none tmd:hidden ml-2.5 when-active-5">{font.source}</div>
                                                    <svg className="w-3 tmd:w-2.5 absolute right-3 fill-theme-3 dark:fill-theme-9 when-active-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    : ( data.fonts.length === 0 && keyword !== ""
                                        ? <div className="w-full h-full absolute left-0 top-0 flex flex-row justify-center items-center text-base tmd:text-xs leading-none text-theme-5 dark:text-theme-7">&quot;<span className="text-theme-3 dark:text-theme-9 font-medium">{keyword}</span>&quot; 에 대한 검색 결과가 없습니다.</div>
                                        : <div className="w-full h-full absolute left-0 top-0 flex flex-row justify-center items-center text-base tmd:text-xs leading-none text-theme-5 dark:text-theme-7"><span className="text-theme-3 dark:text-theme-9 font-medium mr-2">영문/한글 폰트 이름,</span> 또는 <span className="text-theme-3 dark:text-theme-9 font-medium ml-2">회사 이름</span>을 검색해 주세요.</div>
                                    )
                                ) : <></>
                            }
                        </div>
                        <div className="w-full h-12 flex flex-row justify-end items-center px-6 tmd:px-4 border-t text-xs tmd:text-xs text-theme-5 dark:text-theme-7 leading-none border-theme-7 dark:border-theme-3">© 2023. taedonn, all rights reserved.</div>
                    </div>
                </div> : <></>
            }
        </>
    )
}
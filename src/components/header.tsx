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
import FontSearch from "@/components/fontsearch";

// 빈 함수
const emptyFn = () => { return; }

const defaultHeader = {
    page: "",
    handleSearch: emptyFn,
}

interface Header {
    isMac: boolean,
    theme: string,
    user: any,
    page?: string,
    handleSearch?: any,
}

export default function Header (
    {
        isMac,
        theme,
        user,
        page=defaultHeader.page,
        handleSearch=defaultHeader.handleSearch,
    }: Header) {
        
    // states
    const [, setCookie] = useCookies<string>([]);
    const [thisTheme, setTheme] = useState(theme);
    const [searchDisplay, setSearchDisplay] = useState("hide");

    // refs
    const refAccountLabel = useRef<HTMLLabelElement>(null);
    const refAccountDiv = useRef<HTMLDivElement>(null);

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

    /** 계정 영역 외 클릭 */
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
        const inputAccount = document.getElementById("account") as HTMLInputElement;
        inputAccount.checked = false;
    }
    const throttledScroll = throttle(handleScroll,500);
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
    const handleLoginClick = () => { sessionStorage.setItem('login_history', location.href); }

    /** 로고 클릭 시 searchword, filter 초기화 */
    const reset = () => { handleSearch(""); }

    return (
        <>
            <header className="w-full">
                <div className='interface w-full h-16 tlg:h-[52px] px-8 tlg:px-4 fixed right-0 top-0 z-20 flex flex-row justify-between items-center bg-theme-10 dark:bg-theme-2'>
                    <div className="tlg:w-full flex flex-row justify-start items-center">
                        <Link
                            onClick={reset}
                            href="/"
                            aria-label="logo"
                            className="flex items-center gap-3 text-lg"
                        >
                            <div className="w-9 h-9 flex justify-center items-center rounded-lg bg-l-main-1">
                                <i className="text-white fa-solid fa-a"></i>
                            </div>
                            <div className="font-bold text-l-2">폰트 아카이브</div>
                        </Link>
                    </div>
                    <div className='w-max flex flex-row justify-start items-center'>
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
                        <div className="relative mr-3">
                            <label htmlFor="color-theme" className="w-10 h-10 pb-0.5 text-2xl flex justify-center items-center rounded-full cursor-pointer text-l-main-1 hover:bg-l-e">
                                <input onChange={handleColorThemeChange} defaultChecked={thisTheme === 'dark' ? true : false} type="checkbox" id="color-theme" className="hidden peer"/>
                                <i className='block peer-checked:hidden bi bi-cloud-sun'></i>
                                <i className='hidden peer-checked:block bi bi-cloud-moon'></i>
                            </label>
                        </div>
                        <div className="relative flex flex-row justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="peer hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" className="w-8 h-8 flex justify-center items-center cursor-pointer text-l-5">
                                {
                                    user === null
                                    ? <i className="text-3xl bi bi-person-circle"></i>
                                    : <div className="w-8 h-8 relative">
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
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
import Button from "@/components/button";

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
            <header className="w-full h-16">
                <div className='interface w-full h-16 px-8 tlg:px-4 fixed right-0 top-0 z-20 flex justify-between items-center duration-200 bg-white dark:bg-d-2'>
                    <div className="flex justify-start items-center text-l-2 dark:text-white">
                        <Link
                            onClick={reset}
                            href="/"
                            aria-label="logo"
                            className="relative flex items-center gap-3 shrink-0 text-lg"
                        >
                            <div className="w-9 h-9 flex justify-center items-center rounded-lg bg-h-1">
                                <i className="text-white fa-solid fa-a"></i>
                            </div>
                            <div className="font-bold tlg:hidden">폰트 아카이브</div>
                            <div className="hidden tlg:block w-4 h-full absolute -right-8 top-0 bg-gradient-to-r from-white"></div>
                        </Link>
                        <div className={`${page === "index" ? "tlg:w-[calc(100vw-196px)]" : "tlg:w-[calc(100vw-236px)]"} mx-6 tlg:mx-4 overflow-x-auto no-scrollbar`}>
                            <div className="w-max flex gap-2 tlg:gap-0.5 items-center">
                                <Link href="/" onClick={reset} className={`${page === "index" ? "text-h-1 dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}>모든 폰트</Link>
                                <Link href="/issue/font" className={`${page === "issue" ? "text-h-1 dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}>폰트 제보하기</Link>
                                <Link href="/notices" className={`${page === "notices" ? "text-h-1 dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}>공지사항</Link>
                            </div>
                        </div>
                    </div>
                    <div className='w-max relative flex justify-start shrink-0 items-center'>
                        <div className="hidden tlg:block w-4 h-full absolute -left-8 top-0 bg-gradient-to-l from-white dark:from-d-2"></div>
                        <button onClick={handleFontSearch} className={`${page === "index" ? "hidden" : "flex"} w-56 tlg:w-8 h-8 pl-10 tlg:p-0 mr-3 tlg:mr-2 relative text-sm flex-start justify-start items-center rounded-lg text-h-1 dark:text-white hover:text-white hover:dark:text-f-8 bg-h-e dark:bg-d-3 hover:bg-h-1`}>
                            <span className="tlg:hidden">폰트 검색하기...</span>
                            <i className="text-xs absolute left-4 tlg:left-1/2 top-1/2 tlg:-translate-x-1/2 -translate-y-1/2 fa-solid fa-magnifying-glass"></i>
                            <div className="tlg:hidden w-max h-full absolute right-4 flex flex-row justify-center items-center">
                                {
                                    isMac
                                    ? <div className="flex justify-center items-center">
                                        <i className="text-xs bi bi-command"></i>
                                        <span className="text-[13px] ml-px">K</span>
                                    </div>
                                    : ( !isMac
                                        ? <span className="text-[13px]">Ctrl + K</span>
                                        : <></>
                                    )
                                }
                            </div>
                        </button>
                        <div className="relative mr-3 tlg:mr-2">
                            <label htmlFor="color-theme" className="w-10 h-10 text-2xl flex justify-center items-center rounded-full cursor-pointer text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3">
                                <input onChange={handleColorThemeChange} defaultChecked={thisTheme === 'dark' ? true : false} type="checkbox" id="color-theme" className="hidden peer"/>
                                <i className='block peer-checked:hidden bi bi-cloud-sun'></i>
                                <i className='hidden peer-checked:block bi bi-cloud-moon'></i>
                            </label>
                        </div>
                        <div className="relative flex flex-row justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="peer hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" className="w-8 h-8 flex justify-center items-center cursor-pointer text-l-5 dark:text-white hover:text-l-2 hover:dark:text-d-c peer-checked:text-l-2 peer-checked:dark:text-d-c">
                                {
                                    user === null
                                    ? <i className="text-3xl bi bi-person-circle"></i>
                                    : <div className="w-8 h-8 relative">
                                        <Image src={user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover rounded-full"/>
                                    </div>
                                }
                            </label>
                            <div ref={refAccountDiv} id="account-select" className="hidden peer-checked:block w-[136px] absolute right-0 top-10 px-4 py-3 rounded-lg drop-shadow-default dark:drop-shadow-dark cursor-default bg-l-e dark:bg-d-3">
                                <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="flex justify-start items-center text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c selection:bg-transparent">
                                    <i className="fa-brands fa-github"></i>
                                    <span className="ml-1.5">깃허브</span>
                                </Link>
                                <Link href="/notices" className="flex justify-start items-center mt-1.5 text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c selection:bg-transparent">
                                    <i className="fa-solid fa-bell-concierge"></i>
                                    <span className="ml-1.5">공지사항</span>
                                </Link>
                                <Link href="/issue/font" className="flex justify-start items-center mt-1.5 text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c selection:bg-transparent">
                                    <i className="ml-px mr-px text-xs fa-regular fa-paper-plane"></i>
                                    <span className="ml-1.5">폰트 제보하기</span>
                                </Link>
                                <Link href="/issue/bug" className="flex justify-start items-center mt-1.5 text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c selection:bg-transparent">
                                    <i className="ml-px fa-solid fa-virus"></i>
                                    <span className="ml-1.5">버그 리포트</span>
                                </Link>
                                {
                                    user === null
                                    ? <Button marginTop={10}>
                                        <Link href="/user/login" onClick={handleLoginClick} className="w-full h-full flex justify-center items-center">로그인</Link>
                                    </Button>
                                    : <div className="text-sm text-l-2">
                                        <div className="w-full h-px bg-l-b my-2.5"></div>
                                        <div className="text-l-2">{user.name}<span className="text-l-5"> 님,</span></div>
                                        <Link href="/user/info" className="flex justify-start items-center mt-1.5 hover:text-l-5">
                                            <i className="text-base mr-1 bi bi-person-fill-gear"></i>
                                            프로필 정보
                                        </Link>
                                        <Link onClick={reset} href="/?filter=liked" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                            <i className="ml-px mr-1.5 fa-regular fa-heart"></i>
                                            좋아요 목록
                                        </Link>
                                        <Link href="/user/comments" className="flex justify-start items-center mt-1 hover:text-l-5">
                                            <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                                            댓글 목록
                                        </Link>
                                        {
                                            user.id === 1
                                            ? <>
                                                <div className="w-full h-px bg-l-b my-2.5"></div>
                                                <div className="text-l-2">관리자<span className="text-l-5"> 기능</span></div>
                                                <Link href="/admin/font/list" className="flex justify-start items-center mt-1.5 hover:text-l-5">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 목록
                                                </Link>
                                                <Link href="/admin/font/add" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 추가
                                                </Link>
                                                <Link href="/admin/font/edit" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 수정
                                                </Link>
                                                <Link href="/admin/user/list" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="mr-1 text-base bi bi-person-fill-gear"></i>
                                                    유저 목록
                                                </Link>
                                                <Link href="/admin/comment/list" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                                                    댓글 목록
                                                </Link>
                                                <Link href="/admin/issue/list" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-px mr-2 text-xs fa-regular fa-paper-plane"></i>
                                                    폰트 제보
                                                </Link>
                                                <Link href="/admin/bug/list" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-px mr-2 text-xs fa-regular fa-paper-plane"></i>
                                                    버그 제보
                                                </Link>
                                                <Link href="/admin/notices/add" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                                                    공지 추가
                                                </Link>
                                                <Link href="/admin/notices/list" className="flex justify-start items-center mt-0.5 hover:text-l-5">
                                                    <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                                                    공지 목록
                                                </Link>
                                            </> : <></>
                                        }
                                        <Button marginTop={12}>
                                            <button onClick={handleLogout} className="w-full h-full flex justify-center items-center">로그아웃</button>
                                        </Button>
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
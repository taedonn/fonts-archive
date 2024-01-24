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

// common
import { onMouseDown, onMouseUp, onMouseOut } from "@/libs/common";

// 빈 함수
const emptyFn = (e: string) => { return; }

const defaultHeader = {
    page: "",
    handleSearch: emptyFn,
    handleThemeChange: emptyFn,
}

interface Header {
    isMac: boolean,
    theme: string,
    user: any,
    page?: string,
    handleSearch?: any,
    handleThemeChange?: Function,
}

export default function Header (
    {
        isMac,
        theme,
        user,
        page=defaultHeader.page,
        handleSearch=defaultHeader.handleSearch,
        handleThemeChange=defaultHeader.handleThemeChange,
    }: Header) {
        
    // states
    const [, setCookie] = useCookies<string>([]);
    const [alert, setAlert] = useState([]);
    const [thisTheme, setTheme] = useState(theme);
    const [searchDisplay, setSearchDisplay] = useState("hide");

    // refs
    const refAccountLabel = useRef<HTMLLabelElement>(null);
    const refAccountDiv = useRef<HTMLDivElement>(null);
    const refAlertLabel = useRef<HTMLLabelElement>(null);
    const refAlertDiv = useRef<HTMLDivElement>(null);

    /** 컬러 테마 변경 */
    const handleColorThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();

        if (e.target.checked) {
            expires.setMonth(expires.getMonth() + 1);
            setCookie('theme', 'dark', {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            document.documentElement.classList.add('dark');
            setTheme("dark");
            handleThemeChange("dark");
        } else {
            expires.setMonth(expires.getMonth() - 1);
            setCookie('theme', 'light', {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            document.documentElement.classList.remove('dark');
            setTheme("light");
            handleThemeChange("light");
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

    /** 알림 불러오기 */
    useEffect(() => {
        async function fetchAlerts() {
            if (user) {
                const params = {
                    action: "fetch-alerts",
                    user_no: user.id,
                }
        
                await fetch("/api/user/alerts?" + new URLSearchParams(params), {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                .then(res => {
                    const data = res.json();
                    console.log(data);
                })
                .catch(err => console.log(err));
            }
        }
        window.addEventListener("load", fetchAlerts);
        return () => window.removeEventListener("load", fetchAlerts);
    }, [user]);

    /** 알림 영역 외 클릭 */
    useEffect(() => {
        function handleAlertOutside(e: Event) {
            const alert = document.getElementById("alert") as HTMLInputElement;
            if (refAlertDiv?.current && !refAlertDiv.current.contains(e.target as Node) && refAlertLabel.current && !refAlertLabel.current.contains(e.target as Node)) {
                alert.checked = false;
            }
        }
        document.addEventListener("mouseup", handleAlertOutside);
        return () => document.removeEventListener("mouseup", handleAlertOutside);
    },[refAlertDiv, refAlertLabel]);

    /** 알림창 팝업 */
    const handleAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
        const alertPopup = document.getElementById("alert-popup") as HTMLDivElement;
        if (e.target.checked) {
            alertPopup.classList.add("animate-fade-in");
            setTimeout(function() { alertPopup.classList.remove('animate-fade-in'); },600);
        }
    }

    /** lodash/throttle을 이용해 스크롤 제어 */
    const handleScroll = () => {
        const inputAccount = document.getElementById("account") as HTMLInputElement;
        const inputAlert = document.getElementById("alert") as HTMLInputElement;
        inputAccount.checked = false;
        inputAlert.checked = false;
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
                {/* 메인 페이지가 아닐 때 헤더 아래 그라데이션 */}
                { page !== "index" && <div className="w-full h-4 fixed z-20 left-0 top-16 bg-gradient-to-b from-white dark:from-d-2"></div> }
                
                <div className='w-full h-16 px-8 tlg:px-4 fixed right-0 top-0 z-20 flex justify-between items-center bg-white dark:bg-d-2'>
                    <div className="w-full flex justify-start items-center overflow-hidden text-l-2 dark:text-white">
                        <Link
                            onClick={reset}
                            href="/"
                            aria-label="logo"
                            onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut}
                            className="relative flex items-center gap-3 shrink-0 text-lg"
                        >
                            <div className="h-6 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo.svg" alt="로고" referrerPolicy="no-referrer" className="h-full"/>
                            </div>
                            <div className="font-bold tlg:hidden">폰트 아카이브</div>
                            <div className="hidden tlg:block w-4 h-full absolute -right-4 top-0 bg-gradient-to-r from-white from-50% dark:from-d-2"></div>
                        </Link>
                        <div className="w-full overflow-x-auto no-scrollbar">
                            <div className="w-max mx-6 tlg:mx-4">
                                <div className="w-max flex gap-2 tlg:gap-0 items-center">
                                    <Link href="/" onClick={reset} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${page === "index" ? "text-h-1 dark:text-f-8 tlg:hover:text-h-1 tlg:hover:dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8 tlg:hover:text-l-2 tlg:hover:dark:text-white`}>모든 폰트</Link>
                                    <Link href="/issue" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${page === "issue" ? "text-h-1 dark:text-f-8 tlg:hover:text-h-1 tlg:hover:dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8 tlg:hover:text-l-2 tlg:hover:dark:text-white`}>문의하기</Link>
                                    <Link href="/notices" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${page === "notices" ? "text-h-1 dark:text-f-8 tlg:hover:text-h-1 tlg:hover:dark:text-f-8 bg-h-e dark:bg-d-3" : ""} px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8 tlg:hover:text-l-2 tlg:hover:dark:text-white`}>공지사항</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex justify-start shrink-0 items-center'>
                        <div className="hidden tlg:block w-4 h-full absolute -left-4 top-0 bg-gradient-to-l from-white dark:from-d-2"></div>
                        <button onClick={handleFontSearch} onMouseDown={e => onMouseDown(e, 0.95, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${page === "index" ? "hidden" : "flex"} w-56 tlg:w-8 h-8 pl-10 tlg:p-0 mr-3 tlg:mr-1.5 relative text-sm flex-start justify-start items-center rounded-lg text-h-1 dark:text-white hover:text-white hover:dark:text-f-8 tlg:hover:text-h-1 tlg:hover:dark:text-white bg-h-e dark:bg-d-4 hover:bg-h-1 tlg:hover:bg-h-e tlg:hover:dark:bg-d-4`}>
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
                        <div className="relative mr-1 tlg:mr-0">
                            <input onChange={handleAlert} id="alert" type="checkbox" className="hidden peer"/>
                            <label ref={refAlertLabel} htmlFor="alert" onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-10 h-10 pt-px text-[1.375rem] flex justify-center items-center rounded-full cursor-pointer text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3 peer-checked:bg-h-e peer-checked:dark:bg-d-3 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <i className='bi bi-pin-angle'></i>
                            </label>
                            <div ref={refAlertDiv} id="alert-popup" className="hidden peer-checked:block w-48 min-h-20 absolute left-1/2 top-12 -translate-x-1/2 px-4 py-3 rounded-lg drop-shadow-default dark:drop-shadow-dark cursor-default bg-white dark:bg-d-3">
                                
                            </div>
                        </div>
                        <div className="relative mr-3 tlg:mr-1.5">
                            <label htmlFor="color-theme" onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-10 h-10 pb-px text-2xl flex justify-center items-center rounded-full cursor-pointer text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <input onChange={handleColorThemeChange} defaultChecked={thisTheme === 'dark' ? true : false} type="checkbox" id="color-theme" className="hidden peer"/>
                                <i className='block peer-checked:hidden bi bi-cloud-sun'></i>
                                <i className='hidden peer-checked:block bi bi-cloud-moon'></i>
                            </label>
                        </div>
                        <div className="relative flex justify-center items-center cursor-pointer">
                            <input onChange={handleAccount} type="checkbox" id="account" className="peer hidden"/>
                            <label ref={refAccountLabel} htmlFor="account" onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-8 h-8 flex justify-center items-center cursor-pointer text-l-5 dark:text-white hover:text-l-2 hover:dark:text-d-c peer-checked:text-l-2 peer-checked:dark:text-d-c tlg:hover:text-l-5 tlg:hover:dark:text-white">
                                {
                                    user === null
                                    ? <i className="text-3xl bi bi-person-circle"></i>
                                    : <div className="w-8 h-8 relative">
                                        <Image src={user.protected && user.provider !== "credentials" ? user.public_img : user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover rounded-full"/>
                                    </div>
                                }
                            </label>
                            <div ref={refAccountDiv} id="account-select" className="hidden peer-checked:block w-32 absolute right-0 top-10 px-4 py-3 rounded-lg drop-shadow-default dark:drop-shadow-dark cursor-default bg-l-e dark:bg-d-3">
                                <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="flex justify-start items-center text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white selection:bg-transparent">
                                    <i className="fa-brands fa-github"></i>
                                    <span className="ml-1.5">깃허브</span>
                                </Link>
                                <Link href="/notices" className="flex justify-start items-center mt-1.5 text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white selection:bg-transparent">
                                    <i className="fa-solid fa-bell-concierge"></i>
                                    <span className="ml-1.5">공지사항</span>
                                </Link>
                                <Link href="/issue" className="flex justify-start items-center mt-1.5 text-sm text-l-2 dark:text-white hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white selection:bg-transparent">
                                    <i className="ml-px mr-px text-xs fa-regular fa-paper-plane"></i>
                                    <span className="ml-1.5">문의하기</span>
                                </Link>
                                {
                                    user === null
                                    ? <Button height={1.75} marginTop={0.625}>
                                        <Link href="/user/login" onClick={handleLoginClick} className="w-full h-full flex justify-center items-center text-sm">로그인</Link>
                                    </Button>
                                    : <div className="text-sm text-l-2 dark:text-white">
                                        <div className="w-full h-px bg-l-b my-2.5"></div>
                                        <div>{user.name}<span className="text-l-5 dark:text-d-c"> 님,</span></div>
                                        <Link href="/user/info" className="flex justify-start items-center mt-1.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                            <i className="text-base mr-1 bi bi-person-fill-gear"></i>
                                            프로필 정보
                                        </Link>
                                        <Link onClick={reset} href="/?filter=liked" className="flex justify-start items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                            <i className="ml-px mr-1.5 fa-regular fa-heart"></i>
                                            좋아요 목록
                                        </Link>
                                        <Link href="/user/comments" className="flex justify-start items-center mt-1 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                            <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                                            댓글 목록
                                        </Link>
                                        {
                                            user.id === 1
                                            ? <>
                                                <div className="w-full h-px bg-l-b my-2.5"></div>
                                                <div className="text-l-2 dark:text-white">관리자<span className="text-l-5 dark:text-d-c"> 기능</span></div>
                                                <Link href="/admin/font/list" className="flex justify-start items-center mt-1.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 목록
                                                </Link>
                                                <Link href="/admin/font/add" className="flex justify-start items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 추가
                                                </Link>
                                                <Link href="/admin/font/edit" className="flex justify-start items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-px mr-2 fa-solid fa-a"></i>
                                                    폰트 수정
                                                </Link>
                                                <Link href="/admin/user/list" className="flex justify-start items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="mr-1 text-base bi bi-person-fill-gear"></i>
                                                    유저 목록
                                                </Link>
                                                <Link href="/admin/comment/list" className="flex justify-start items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                                                    댓글 목록
                                                </Link>
                                                <Link href="/admin/issue/list" className="flex justify-start items-center mt-1 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-px mr-2 text-xs fa-regular fa-paper-plane"></i>
                                                    문의 목록
                                                </Link>
                                                <Link href="/admin/notices/add" className="flex justify-start items-center mt-1 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                                                    공지 추가
                                                </Link>
                                                <Link href="/admin/notices/list" className="flex justify-start items-center mt-1 hover:text-l-5 hover:dark:text-d-c tlg:hover:text-l-2 tlg:hover:dark:text-white">
                                                    <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                                                    공지 목록
                                                </Link>
                                            </> : <></>
                                        }
                                        <Button height={1.75} marginTop={0.625}>
                                            <button onClick={handleLogout} className="w-full h-full flex justify-center items-center text-sm">로그아웃</button>
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
// next
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// next-auth
import { signOut } from "next-auth/react";

// react
import React, { useEffect, useRef, useState } from "react";

// libraries
import { throttle } from "lodash";
import { useCookies } from "react-cookie";
import { useInfiniteQuery } from "react-query";

// components
import Button from "@/components/button";
import FontSearch from "@/components/fontsearch";

// common
import {
  hideUserName,
  onMouseDown,
  onMouseOut,
  onMouseUp,
  timeDiff,
} from "@/libs/common";

// global
import { alerts } from "@/libs/global";

// 빈 함수
const emptyFn = (e: string) => {
  return;
};

const defaultHeader = {
  page: "",
  handleSearch: emptyFn,
  handleThemeChange: emptyFn,
};

interface Header {
  isMac: boolean;
  theme: string;
  user: any;
  page?: string;
  handleSearch?: any;
  handleThemeChange?: Function;
}

export default function Header({
  isMac,
  theme,
  user,
  page = defaultHeader.page,
  handleSearch = defaultHeader.handleSearch,
  handleThemeChange = defaultHeader.handleThemeChange,
}: Header) {
  // router
  const router = useRouter();

  // states
  const [, setCookie] = useCookies<string>([]);
  const [alertsDisplay, setAlertsDisplay] = useState<boolean>(false);
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
      setCookie("theme", "dark", {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-color-scheme", "dark");
      setTheme("dark");
      handleThemeChange("dark");
    } else {
      expires.setMonth(expires.getMonth() - 1);
      setCookie("theme", "light", {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-color-scheme", "light");
      setTheme("light");
      handleThemeChange("light");
    }
  };

  /** 계정 영역 외 클릭 */
  useEffect(() => {
    function handleAccountOutside(e: Event) {
      const account = document.getElementById("account") as HTMLInputElement;
      if (
        refAccountDiv?.current &&
        !refAccountDiv.current.contains(e.target as Node) &&
        refAccountLabel.current &&
        !refAccountLabel.current.contains(e.target as Node)
      ) {
        account.checked = false;
      }
    }
    document.addEventListener("mouseup", handleAccountOutside);
    return () => document.removeEventListener("mouseup", handleAccountOutside);
  }, [refAccountDiv, refAccountLabel]);

  /** 계정 선택창 팝업 */
  const handleAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountSelect = document.getElementById(
      "account-select"
    ) as HTMLDivElement;
    if (e.target.checked) {
      accountSelect.classList.add("animate-fade-in-account");
      setTimeout(function () {
        accountSelect.classList.remove("animate-fade-in-account");
      }, 600);
    }
  };

  /** useInfiniteQuery로 알럿 불러오기 */
  const { isLoading, data, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery(
      ["alerts", { keepPreviousData: true }],
      async ({ pageParam = "" }) => {
        await new Promise((res) => setTimeout(res, 100));
        const url = "/api/user/alerts?";
        const options = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const params = {
          user_id: user ? user.id : null,
          id: pageParam,
          action: "fetch-alerts",
          admin: user.id === 1 ? "true" : "false",
          user_email: user.email,
          user_auth: user.auth,
        };
        const query = new URLSearchParams(params).toString();

        const res = await fetch(url + query, options);
        const data = res.json();
        return data;
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
        enabled: !!user, // user가 undefined면 쿼리 실행 안함
        refetchOnWindowFocus: false, // 탭 이동, 창 이동 시 stale 상태가 아니면 refetch 할지 안할지 정하는 옵션. default: always
        staleTime: 15 * 1000, // stale(fresh) 상태일 때는 refetch 안함. 얼마동안 stale 상태로 보낼 지 정하는 옵션. default: 0
      }
    );

  /** "알림 더 보기" 버튼 클릭 */
  const fetchNextAlerts = () => {
    if (hasNextPage) fetchNextPage();
  };

  /** 알림 영역 외 클릭 */
  useEffect(() => {
    function handleAlertOutside(e: Event) {
      const alert = document.getElementById("alert") as HTMLInputElement;
      if (
        refAlertDiv?.current &&
        !refAlertDiv.current.contains(e.target as Node) &&
        refAlertLabel.current &&
        !refAlertLabel.current.contains(e.target as Node)
      ) {
        setAlertsDisplay(false);
        alert.checked = false;
      }
    }
    document.addEventListener("mouseup", handleAlertOutside);
    return () => document.removeEventListener("mouseup", handleAlertOutside);
  }, [refAlertDiv, refAlertLabel]);

  /** 알림창 팝업 */
  const handleAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertsDisplay(e.target.checked);
  };

  /** "모두 읽음 표시" 버튼 클릭 */
  const handleReadAllAlerts = async () => {
    const url = "/api/user/alerts";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "read-all-alerts",
        recipent_email: user.email,
        recipent_auth: user.provider,
      }),
    };

    await fetch(url, options)
      .then(() => refetch())
      .catch((err) => console.log(err));
  };

  /** "읽음으로 표시" 버튼 클릭 */
  const handleReadAlerts = async (alertId: number, alertRead: boolean) => {
    if (!alertRead) {
      const url = "/api/user/alerts";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "read-alerts",
          alert_id: alertId,
        }),
      };

      await fetch(url, options)
        .then(() => refetch())
        .catch((err) => console.log(err));
    }
  };

  /** lodash/throttle을 이용해 스크롤 제어 */
  const handleScroll = () => {
    const inputAccount = document.getElementById("account") as HTMLInputElement;
    inputAccount.checked = false;
  };
  const throttledScroll = throttle(handleScroll, 500);
  useEffect(() => {
    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  });

  /** 폰트 검색 버튼 클릭 */
  const handleFontSearch = () => {
    setSearchDisplay("show");
    document.body.style.overflow = "hidden";
  };

  /** 폰트 검색 ESC 버튼 클릭 */
  const handleFontSearchCloseBtn = () => {
    setSearchDisplay("hide");
    document.body.style.overflow = "auto";
  };

  /** 로그아웃 버튼 클릭 */
  const handleLogout = () => {
    signOut();
  };

  /** 로그인 버튼 클릭 */
  const handleLoginClick = () => {
    sessionStorage.setItem("login_history", location.href);
  };

  /** 로고 클릭 시 searchword, filter 초기화 */
  const reset = () => {
    handleSearch("");
  };

  return (
    <>
      <header className="w-full h-16 text-l-2 dark:text-white">
        {/* 메인 페이지가 아닐 때 헤더 아래 그라데이션 */}
        {page !== "index" && page !== "post" && (
          <div className="w-full h-4 fixed z-20 left-0 top-16 bg-gradient-to-b from-white dark:from-d-2"></div>
        )}

        <div className="w-full h-16 px-4 lg:px-8 fixed right-0 top-0 z-20 flex justify-between items-center bg-white dark:bg-d-2">
          <div className="w-full flex items-center overflow-hidden">
            <Link
              onClick={reset}
              href="/"
              aria-label="logo"
              onMouseDown={(e) => onMouseDown(e, 0.9, true)}
              onMouseUp={onMouseUp}
              onMouseOut={onMouseOut}
              className="relative flex items-center gap-3 shrink-0 text-lg"
            >
              <div className="h-6 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="로고"
                  referrerPolicy="no-referrer"
                  className="h-full"
                />
              </div>
              <div className="font-bold tlg:hidden">폰트 아카이브</div>
              <div className="lg:hidden w-4 h-12 absolute z-10 -right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white from-50% dark:from-d-2"></div>
            </Link>
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="w-max mx-6 tlg:mx-4">
                <div className="w-max flex lg:gap-2 items-center">
                  <Link
                    href="/"
                    onClick={reset}
                    onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                    onMouseUp={onMouseUp}
                    onMouseOut={onMouseOut}
                    className={`${
                      page === "index"
                        ? "text-h-1 dark:text-f-8 hover:text-h-1 hover:dark:text-f-8 bg-h-e dark:bg-d-3"
                        : ""
                    } px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}
                  >
                    모든 폰트
                  </Link>
                  <Link
                    href="/issue"
                    onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                    onMouseUp={onMouseUp}
                    onMouseOut={onMouseOut}
                    className={`${
                      page === "issue"
                        ? "text-h-1 dark:text-f-8 hover:text-h-1 hover:dark:text-f-8 bg-h-e dark:bg-d-3"
                        : ""
                    } px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}
                  >
                    문의하기
                  </Link>
                  <Link
                    href="/notices"
                    onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                    onMouseUp={onMouseUp}
                    onMouseOut={onMouseOut}
                    className={`${
                      page === "notices"
                        ? "text-h-1 dark:text-f-8 hover:text-h-1 hover:dark:text-f-8 bg-h-e dark:bg-d-3"
                        : ""
                    } px-3 py-1.5 rounded-lg tlg:text-sm font-medium hover:text-h-1 hover:dark:text-f-8`}
                  >
                    공지사항
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex shrink-0 items-center">
            <div className="lg:hidden w-4 h-12 absolute z-10 -left-4 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white dark:from-d-2"></div>
            <button
              onClick={handleFontSearch}
              onMouseDown={(e) => onMouseDown(e, 0.95, true)}
              onMouseUp={onMouseUp}
              onMouseOut={onMouseOut}
              className={`${
                page === "index" ? "hidden" : "flex"
              } w-56 tlg:w-8 h-8 lg:pl-10 mr-1.5 lg:mr-3 relative text-sm items-center rounded-lg text-h-1 dark:text-white hover:text-white hover:dark:text-f-8 bg-h-e dark:bg-d-3 hover:bg-h-1 hover:dark:bg-d-4`}
            >
              <span className="tlg:hidden">폰트 검색하기...</span>
              <i className="text-xs absolute left-1/2 lg:left-4 top-1/2 tlg:-translate-x-1/2 -translate-y-1/2 fa-solid fa-magnifying-glass"></i>
              <div className="lg:flex hidden w-max h-full absolute right-4 justify-center items-center">
                {isMac ? (
                  <div className="flex justify-center items-center">
                    <i className="text-xs bi bi-command"></i>
                    <span className="text-[13px] ml-px">K</span>
                  </div>
                ) : !isMac ? (
                  <span className="text-[13px]">Ctrl + K</span>
                ) : (
                  <></>
                )}
              </div>
            </button>
            <div className="relative lg:mr-1">
              <input
                onChange={handleAlert}
                id="alert"
                type="checkbox"
                className="hidden peer"
              />
              <label
                ref={refAlertLabel}
                htmlFor="alert"
                onMouseDown={(e) => onMouseDown(e, 0.85, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className="group w-10 h-10 pt-px text-[1.375rem] relative flex justify-center items-center rounded-full cursor-pointer text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3 peer-checked:bg-h-e peer-checked:dark:bg-d-3"
              >
                <i className="bi bi-pin-angle"></i>
                {data &&
                  data.pages[0].alerts.some(
                    (alert: alerts) => alert.alert_read === false
                  ) && (
                    <div className="w-1.5 h-1.5 absolute left-1 top-2 rounded-full bg-h-r animate-pulse"></div>
                  )}
                <div className="peer-checked:group-hover:hidden w-max absolute z-10 left-1/2 top-11 px-3 py-1.5 text-[0.813rem] leading-none origin-top rounded hidden group-hover:block group-hover:animate-hover-delay bg-h-e dark:bg-d-4 text-h-1 dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent">
                  알림
                </div>
              </label>
              {alertsDisplay && (
                <div
                  ref={refAlertDiv}
                  id="alert-popup"
                  className="animate-fade-in-account w-80 min-h-20 absolute -right-[4.75rem] lg:-right-[5.5rem] top-12 py-3 pb-12 rounded-lg drop-shadow-default dark:drop-shadow-dark cursor-default bg-white dark:bg-d-3"
                >
                  <div className="mb-3 px-4 w-full flex justify-between text-xs">
                    <h2 className="text-base font-medium text-l-2 dark:text-white">
                      알림
                    </h2>
                    {user && (
                      <button
                        onClick={handleReadAllAlerts}
                        className="text-h-1 dark:text-f-8 hover:underline"
                      >
                        모두 읽음 표시
                      </button>
                    )}
                  </div>
                  <div className="w-full max-h-80 overflow-y-auto custom-sm-scrollbar border-y border-l-b dark:border-d-6">
                    <div className="w-full text-sm">
                      {data &&
                        data.pages.map((page) => {
                          return (
                            <React.Fragment key={page.nextId ?? "lastPage"}>
                              {page.alerts.map((alert: alerts) => (
                                <div
                                  key={alert.alert_id}
                                  className={`${
                                    alert.alert_read
                                      ? ""
                                      : "bg-h-e dark:bg-f-8/10"
                                  } w-full p-4 flex gap-3 border-b last:border-transparent border-l-d dark:border-d-4`}
                                >
                                  <div className="relative w-8 h-8 rounded-full shrink-0">
                                    <Image
                                      src={alert.sender_img}
                                      alt="알림 이미지"
                                      fill
                                      sizes="100%"
                                      referrerPolicy="no-referrer"
                                      className="object-cover rounded-full"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <div>
                                      <span className="font-bold">
                                        {hideUserName(alert.sender_name, 1)}
                                      </span>
                                      님이{" "}
                                      <span className="font-bold">
                                        [{alert.alert_page}]
                                      </span>
                                      에{" "}
                                      {alert.alert_type === "comment"
                                        ? "댓글"
                                        : "답글"}
                                      을 남겼습니다.
                                    </div>
                                    <Link
                                      href={alert.alert_link}
                                      className="flex flex-col hover:underline"
                                    >
                                      <div className="ellipsed-text">
                                        {alert.sender_content}
                                      </div>
                                    </Link>
                                    <div className="text-xs flex gap-2">
                                      <div className="text-l-9">
                                        {timeDiff(alert.created_at.toString())}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleReadAlerts(
                                            alert.alert_id,
                                            alert.alert_read
                                          )
                                        }
                                        className={`${
                                          alert.alert_read
                                            ? "text-l-9 cursor-default"
                                            : "text-h-1 dark:text-f-8 hover:underline"
                                        }`}
                                      >
                                        {alert.alert_read
                                          ? "읽음"
                                          : "읽음으로 표시"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </React.Fragment>
                          );
                        })}
                    </div>

                    {/* 알람이 없을 때 */}
                    {data && data.pages[0].alerts.length === 0 && (
                      <div className="w-full h-32 flex justify-center items-center text-sm text-l-9">
                        {user
                          ? "알림이 없습니다."
                          : "로그인 시 알림을 받을 수 있습니다."}
                      </div>
                    )}

                    {/* 로그인 시 알림을 받을 수 있습니다. */}
                    {!user && (
                      <div className="w-full h-32 flex justify-center items-center text-sm text-l-9">
                        {user
                          ? "알림이 없습니다."
                          : "로그인 시 알림을 받을 수 있습니다."}
                      </div>
                    )}

                    {/* 알림 더 보기 */}
                    {hasNextPage && (
                      <div className="mt-5 mb-5 w-full flex gap-1.5 justify-center items-center text-sm text-h-1 dark:text-f-8">
                        <button
                          onClick={fetchNextAlerts}
                          className={`${
                            isLoading && "cursor-default"
                          } hover:underline mt-0.5`}
                        >
                          알림 더 보기
                        </button>
                        {isLoading && (
                          <span className="loader w-3 h-3 border-2 border-l-b dark:border-d-6 border-b-h-1 dark:border-b-f-8"></span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative mr-1.5 lg:mr-3">
              <label
                htmlFor="color-theme"
                onMouseDown={(e) => onMouseDown(e, 0.85, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className="group w-10 h-10 pb-px text-2xl flex justify-center items-center rounded-full cursor-pointer text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3"
              >
                <input
                  onChange={handleColorThemeChange}
                  defaultChecked={thisTheme === "dark" ? true : false}
                  type="checkbox"
                  id="color-theme"
                  className="hidden peer"
                />
                <i className="block peer-checked:hidden bi bi-cloud-sun"></i>
                <i className="hidden peer-checked:block bi bi-cloud-moon"></i>
                <div className="w-max absolute z-10 left-1/2 top-11 px-3 py-1.5 text-[0.813rem] leading-none origin-top rounded hidden group-hover:block group-hover:animate-hover-delay bg-h-e dark:bg-d-4 text-h-1 dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent">
                  {thisTheme === "dark" ? "라이트 모드" : "다크 모드"}
                </div>
              </label>
            </div>
            <div className="relative flex justify-center items-center cursor-pointer">
              <input
                onChange={handleAccount}
                type="checkbox"
                id="account"
                className="peer hidden"
              />
              <label
                ref={refAccountLabel}
                htmlFor="account"
                onMouseDown={(e) => onMouseDown(e, 0.85, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className="w-8 h-8 flex justify-center items-center cursor-pointer text-l-5 dark:text-white hover:text-l-2 hover:dark:text-d-c peer-checked:text-l-2 peer-checked:dark:text-d-c"
              >
                {user === null ? (
                  <i className="text-3xl bi bi-person-circle"></i>
                ) : (
                  <div className="w-8 h-8 relative">
                    <Image
                      src={
                        user.protected && user.provider !== "credentials"
                          ? user.public_img
                          : user.image
                      }
                      alt="유저 프로필 사진"
                      fill
                      sizes="100%"
                      referrerPolicy="no-referrer"
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
              </label>
              <div
                ref={refAccountDiv}
                id="account-select"
                className="hidden peer-checked:block w-32 absolute right-0 top-10 px-4 py-3 rounded-lg drop-shadow-default dark:drop-shadow-dark cursor-default bg-l-f dark:bg-d-3"
              >
                <Link
                  href="https://github.com/fonts-archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:text-l-5 hover:dark:text-d-c selection:bg-transparent"
                >
                  <i className="fa-brands fa-github"></i>
                  <span className="ml-1.5">깃허브</span>
                </Link>
                <Link
                  href="/notices"
                  className="flex items-center mt-1.5 text-sm hover:text-l-5 hover:dark:text-d-c selection:bg-transparent"
                >
                  <i className="fa-solid fa-bell-concierge"></i>
                  <span className="ml-1.5">공지사항</span>
                </Link>
                <Link
                  href="/issue"
                  className="flex items-center mt-1.5 text-sm hover:text-l-5 hover:dark:text-d-c selection:bg-transparent"
                >
                  <i className="ml-px mr-px text-xs fa-regular fa-paper-plane"></i>
                  <span className="ml-1.5">문의하기</span>
                </Link>
                {user === null ? (
                  <Button height={1.75} marginTop={0.625}>
                    <Link
                      href="/user/login"
                      onClick={handleLoginClick}
                      className="w-full h-full flex justify-center items-center text-sm"
                    >
                      로그인
                    </Link>
                  </Button>
                ) : (
                  <div className="text-sm">
                    <div className="w-full h-px bg-l-b dark:bg-d-6 my-2.5"></div>
                    <div>
                      {user.name}
                      <span className="text-l-5 dark:text-d-c"> 님,</span>
                    </div>
                    <Link
                      href="/user/info"
                      className="flex items-center mt-1.5 hover:text-l-5 hover:dark:text-d-c"
                    >
                      <i className="text-base mr-1 bi bi-person-fill-gear"></i>
                      프로필 정보
                    </Link>
                    <Link
                      onClick={reset}
                      href="/?filter=liked"
                      className="flex items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c"
                    >
                      <i className="ml-px mr-1.5 fa-regular fa-heart"></i>
                      좋아요 목록
                    </Link>
                    <Link
                      href="/user/comments"
                      className="flex items-center mt-1 hover:text-l-5 hover:dark:text-d-c"
                    >
                      <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                      댓글 목록
                    </Link>
                    {user.id === 1 ? (
                      <>
                        <div className="w-full h-px bg-l-b dark:bg-d-6 my-2.5"></div>
                        <div>
                          관리자
                          <span className="text-l-5 dark:text-d-c"> 기능</span>
                        </div>
                        <Link
                          href="/admin/font/list"
                          className="flex items-center mt-1.5 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-px mr-2 fa-solid fa-a"></i>
                          폰트 목록
                        </Link>
                        <Link
                          href="/admin/font/add"
                          className="flex items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-px mr-2 fa-solid fa-a"></i>
                          폰트 추가
                        </Link>
                        <Link
                          href="/admin/font/edit"
                          className="flex items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-px mr-2 fa-solid fa-a"></i>
                          폰트 수정
                        </Link>
                        <Link
                          href="/admin/user/list"
                          className="flex items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="mr-1 text-base bi bi-person-fill-gear"></i>
                          유저 목록
                        </Link>
                        <Link
                          href="/admin/comment/list"
                          className="flex items-center mt-0.5 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-px mr-1.5 fa-regular fa-comment"></i>
                          댓글 목록
                        </Link>
                        <Link
                          href="/admin/issue/list"
                          className="flex items-center mt-1 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-px mr-2 text-xs fa-regular fa-paper-plane"></i>
                          문의 목록
                        </Link>
                        <Link
                          href="/admin/notices/add"
                          className="flex items-center mt-1 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                          공지 추가
                        </Link>
                        <Link
                          href="/admin/notices/list"
                          className="flex items-center mt-1 hover:text-l-5 hover:dark:text-d-c"
                        >
                          <i className="ml-0.5 mr-2 text-xs fa-regular fa-flag"></i>
                          공지 목록
                        </Link>
                      </>
                    ) : (
                      <></>
                    )}
                    <Button height={1.75} marginTop={0.625}>
                      <button
                        onClick={handleLogout}
                        className="w-full h-full flex justify-center items-center text-sm"
                      >
                        로그아웃
                      </button>
                    </Button>
                  </div>
                )}
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
  );
}

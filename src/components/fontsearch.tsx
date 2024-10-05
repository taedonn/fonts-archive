// react
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

// next
import Link from "next/link";
import { useRouter } from "next/router";

// common
import { onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

export default function FontSearch({
  isMac,
  display,
  closeBtn,
  showBtn,
}: {
  isMac: boolean;
  display: string;
  closeBtn: any;
  showBtn: any;
}) {
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
        if (keys["Meta"] && keys["k"]) {
          showBtn();
          e.preventDefault();
        }
        if (keys["Escape"]) {
          closeBtn();
        }
      } else {
        if (keys["Control"] && keys["k"]) {
          showBtn();
          e.preventDefault();
        }
        if (keys["Escape"]) {
          closeBtn();
        }
      }

      // 검색창 보임/숨김 체크
      if (keys["ArrowUp"] && display === "show") {
        // 키다운 시 isKeyDown state를 true로 변경
        setIsKeyDown(true);

        if (activeEl > 0) {
          setActiveEl(activeEl - 1);
        }
        e.preventDefault();
      }
      if (keys["ArrowDown"] && display === "show") {
        // 키다운 시 isKeyDown state를 true로 변경
        setIsKeyDown(true);

        if (activeEl < totalEl - 1) {
          setActiveEl(activeEl + 1);
        } else if (activeEl === totalEl - 1) {
          setActiveEl(0);
        }
        e.preventDefault();
      }

      // 엔터키 눌렀을 때 해당 페이지로 이동s
      if (keys["Enter"] && activeRef.current) {
        router.push(activeRef.current.href);
      }
    };
    const handleKeyup = (e: KeyboardEvent) => {
      keys[e.key] = false;

      // 키업 시 isKeyDown state를 false로 변경
      setIsKeyDown(false);
    };

    window.addEventListener("keydown", handleKeydown, false);
    window.addEventListener("keyup", handleKeyup, false);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBtn, closeBtn, activeEl, totalEl]);

  /** esc 버튼 클릭 */
  const handleCloseBtn = () => {
    closeBtn();
  };

  // showBtn, closeBtn 함수가 실행될 때 keyword를 빈칸으로 변경
  useEffect(() => {
    setKeyword("");
  }, [showBtn, closeBtn]);

  // 셀렉트 박스 - "검색 선택" 외 영역 클릭
  useEffect(() => {
    function handleSearchOutside(e: Event) {
      if (
        refSearchOutside?.current &&
        !refSearchOutside.current.contains(e.target as Node)
      ) {
        closeBtn();
      }
    }
    document.addEventListener("mouseup", handleSearchOutside);
    return () => document.removeEventListener("mouseup", handleSearchOutside);
  }, [closeBtn, refSearchOutside]);

  // useQuery를 이용한 데이터 파싱
  const { isLoading, isRefetching, isSuccess, data, remove, refetch } =
    useQuery(["font-search"], async () => {
      const url = "/api/fontsearch?";
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const params = {
        keyword: keyword,
        action: "user",
      };
      const query = new URLSearchParams(params).toString();

      const res = await fetch(url + query, options);
      const data = res.json();
      return data;
    });

  // display가 show 상태가 아닐 시 useQuery 실행 중지
  useEffect(() => {
    if (display !== "show") {
      remove();
    }
  }, [display, remove]);

  // lodash/debounce가 적용된 검색 기능
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e);
  };
  const debouncedSearch = debounce((e) => {
    setKeyword(e.target.value);
  }, 500);

  // 검색 키워드가 변경되면 refetch
  useEffect(() => {
    setActiveEl(0);
    refetch();
  }, [keyword, refetch]);

  // 검색창 닫을 때 active 링크를 0으로 리셋
  useEffect(() => {
    setActiveEl(0);
  }, [closeBtn]);

  // 검색 결과 마우스 오버 시 active
  const handleLinkMouseOver = (idx: number) => {
    if (!isKeyDown) {
      setActiveEl(idx);
    }
  };

  // 검색 결과 총 개수
  useEffect(() => {
    if (data !== undefined) {
      setTotalEl(data.fonts.length);
    }
  }, [data]);

  // active 링크가 targetElement보다 스크롤이 아래에 있을 때
  useEffect(() => {
    if (parentRef.current && activeRef.current) {
      const parent = parentRef.current.getBoundingClientRect();
      const parentBottom = parent.top + parent.height;
      const active = activeRef.current.getBoundingClientRect();
      const activeBottom = active.top + active.height;

      if (activeBottom - parentBottom > 0) {
        parentRef.current.scrollTop =
          parentRef.current.scrollTop + (activeBottom - parentBottom);
      } else if (parent.top - active.top > 0) {
        parentRef.current.scrollTop =
          parentRef.current.scrollTop - (parent.top - active.top);
      }
    }
  }, [activeEl]);

  // 라우팅 끝날 때 검색창 닫기
  useEffect(() => {
    const end = () => {
      closeBtn();
    };
    router.events.on("routeChangeComplete", end);
    return () => {
      router.events.off("routeChangeComplete", end);
    };
  }, [router, closeBtn]);

  return (
    <>
      {display === "show" ? (
        <div className="w-full h-full fixed left-0 top-0 z-40 pt-16 lg:pt-24 tlg:px-4 flex flex-col items-center backdrop-blur text-l-2 dark:text-white">
          <div
            ref={refSearchOutside}
            className="w-full lg:w-[45rem] relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark bg-white dark:bg-d-2"
          >
            <div className="w-full flex flex-col">
              <div className="w-full h-14 tlg:h-12 px-14 relative flex justify-center items-center border-b border-l-b dark:border-d-6">
                <i className="tlg:text-sm absolute left-5 top-1/2 -translate-y-1/2 fa-solid fa-magnifying-glass"></i>
                <input
                  onChange={handleSearch}
                  type="text"
                  placeholder="폰트 검색하기..."
                  autoFocus
                  className="w-full h-full leading-none placeholder-l-5 dark:placeholder-d-c bg-transparent"
                />
                <button
                  onClick={handleCloseBtn}
                  className="w-8 h-8 absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-l-e hover:dark:bg-d-3"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="w-[calc(100%-0.25rem)] h-6 absolute z-10 left-0 -bottom-px translate-y-full bg-gradient-to-b from-white dark:from-d-2"></div>
              </div>
              <div
                ref={parentRef}
                className="custom-sm-scrollbar w-full min-h-[7.5rem] lg:min-h-[9.375rem] max-h-[31.25rem] relative overflow-auto"
              >
                {/* 로딩 바 */}
                {isLoading && (
                  <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
                    <span className="loader w-9 h-9 border-2 border-h-e dark:border-d-9 border-b-h-1 dark:border-b-f-8"></span>
                  </div>
                )}
                {isRefetching && (
                  <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
                    <span className="loader w-9 h-9 border-2 border-h-e dark:border-d-9 border-b-h-1 dark:border-b-f-8"></span>
                  </div>
                )}

                {/* 검색 결과 */}
                {isSuccess && !isLoading && !isRefetching ? (
                  data.fonts.length !== 0 ? (
                    <div className="w-full p-6">
                      <div className="text-lg mb-4 font-bold">검색 결과</div>
                      {data &&
                        data.fonts.map(
                          (
                            font: {
                              code: number;
                              name: string;
                              source: string;
                              font_family: string;
                            },
                            idx: number
                          ) => {
                            return (
                              <Link
                                aria-label="search-result-link"
                                onMouseOver={() => handleLinkMouseOver(idx)}
                                id={activeEl === idx ? "active" : ""}
                                ref={activeEl === idx ? activeRef : null}
                                href={`/post/${font.font_family.replaceAll(
                                  " ",
                                  "+"
                                )}`}
                                key={font.code}
                                onMouseDown={(e) => onMouseDown(e, 0.95, true)}
                                onMouseUp={onMouseUp}
                                onMouseOut={onMouseOut}
                                className="px-4 mt-2.5 first:mt-0 w-full h-12 lg:h-16 gap-3 relative flex items-center rounded-lg bg-l-f dark:bg-d-3 cursor-pointer"
                              >
                                <div className="when-active-1 w-6 h-6 rounded-md flex justify-center items-center bg-l-e dark:bg-d-4">
                                  <i className="when-active-2 text-sm fa-solid fa-hashtag"></i>
                                </div>
                                <div className="when-active-3 font-medium">
                                  {font.name}
                                </div>
                                <div className="when-active-4 text-sm text-l-5 dark:text-d-c font-normal tlg:hidden">
                                  {font.font_family}
                                </div>
                                <div className="when-active-5 text-sm text-l-5 dark:text-d-c font-normal tlg:hidden">
                                  {font.source}
                                </div>
                                <i className="when-active-6 text-sm absolute right-4 fa-solid fa-angle-right"></i>
                              </Link>
                            );
                          }
                        )}
                    </div>
                  ) : data.fonts.length === 0 && keyword !== "" ? (
                    <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center tlg:text-sm text-l-5 dark:text-d-c">
                      &quot;
                      <span className="text-l-2 dark:text-white font-medium">
                        {keyword}
                      </span>
                      &quot; 에 대한 검색 결과가 없습니다.
                    </div>
                  ) : (
                    <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center tlg:text-sm text-l-5 dark:text-d-c">
                      <span className="text-l-2 dark:text-white font-medium mr-2">
                        영문/한글 폰트 이름,
                      </span>{" "}
                      또는{" "}
                      <span className="text-l-2 dark:text-white font-medium ml-2">
                        회사 이름
                      </span>
                      을 검색해 주세요.
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
              <div className="w-full h-12 lg:h-14 text-xs relative flex justify-end items-center px-6 border-t text-l-9 dark:text-d-9 border-l-b dark:border-d-6">
                © 2023 - {new Date().getFullYear()}. 태돈, all rights reserved.
                <div className="w-[calc(100%-0.25rem)] h-6 absolute z-10 left-0 -top-px -translate-y-full bg-gradient-to-t from-white dark:from-d-2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

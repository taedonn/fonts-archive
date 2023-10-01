// react hooks
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { debounce } from "lodash";

// next hooks
import { NextSeo } from "next-seo";

// api
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";

// components
import Header from "@/components/header";
import axios from "axios";

const Index = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 빈 함수
    const emptyFn = () => { return; }

    // 검색 키워드 디폴트: 빈 문자열
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<any>([]);
    const [focus, setFocus] = useState<boolean>(false);

    // useQuery를 이용한 데이터 파싱
    const {
        isLoading, 
        isRefetching, 
        isSuccess, 
        refetch
    } = useQuery(['font-search'], async () => {
        await axios.get("/api/fontsearch", { params: {keyword: keyword}})
        .then((res) => { setData(res.data) })
        .catch(err => console.log(err));
    });

    // lodash/debounce가 적용된 검색 기능
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }
    const debouncedSearch = debounce((e) => { setKeyword(e.target.value); }, 500);

    // 검색 키워드가 변경되거나, 검색창이 띄워지면 refetch
    useEffect(() => { refetch(); }, [keyword, focus, refetch]);

    // 검색바가 포커스 되면 검색창 띄우기
    const handleFocus = () => { setFocus(true); }

    // // 검색바가 포커스 되면 검색창 숨기기
    const handleBlur = () => { setFocus(false); }

    /** 웹 폰트 적용하기 복사 버튼 클릭 이벤트 */
    const copyOnClick = (e: any) => {
        const btn = document.getElementById(e.target.id) as HTMLButtonElement;
        const copyBtn = btn.getElementsByClassName("copy_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(btn.value);

        copyBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'none';
        },1000);
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 수정 · 폰트 아카이브"}
                description={"폰트 수정 - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"login"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>폰트 수정</h2>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="w-content relative">
                            <label htmlFor='search-font' className='block text-[14px] ml-px'>폰트 검색</label>
                            <input onChange={handleSearch} onFocus={handleFocus} onBlur={handleBlur} type='text' id='search-font' tabIndex={1} placeholder='폰트명/회사명을 입력해 주세요...' className={`w-[280px] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            <div style={focus ? {display: "block"} : {display: "none"}} className="edit-font-search w-[100%] h-[180px] overflow-y-auto absolute bottom-[-6px] translate-y-[100%] rounded-[8px] py-[10px] dark:bg-theme-blue-2">
                                {
                                    data.fonts && isSuccess && !isLoading && !isRefetching
                                    ? data.fonts.length !== 0
                                        ? data.fonts.map((font: any) => {
                                            return (
                                                <div key={font.code} id={font.name} className="group w-[100%] h-[36px] px-[12px] flex items-center bg-transparent hover:dark:bg-theme-blue-1 text-[12px] cursor-pointer">
                                                    <div className="text-theme-7 group-hover:text-theme-blue-2">{font.code}</div>
                                                    <div className="text-theme-9 group-hover:text-theme-blue-2 font-bold shrink-0 ml-[12px]">{font.name}</div>
                                                    <div className="ellipsed-text-1 text-theme-7 group-hover:text-theme-blue-2 ml-[12px] text-ellipsis overflow-hidden">{font.source}</div>
                                                </div>
                                            )
                                        })
                                        : <div className="w-[100%] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                                            <div className="text-center text-[12px] text-theme-10 dark:text-theme-9">폰트 검색 결과가 없습니다.</div>
                                        </div>
                                    : <></>
                                }
                            </div>
                        </div>
                        <div className="w-[100%] h-px my-[16px] bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <div className="text-[14px] flex flex-col">
                            <label htmlFor="font-code">폰트 번호</label>
                            <input type="text" id="font-code" placeholder="폰트 번호" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-name" className="mt-[20px]">폰트 이름</label>
                            <input type="text" id="font-name" placeholder="나눔 바른 고딕" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-lang" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 언어</div>
                                <div className="inline-block leading-loose text-[12px] dark:text-theme-blue-1 cursor-text">[KR, EN]</div>
                            </label>
                            <input type="text" id="font-lang" placeholder="KR" maxLength={2} className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-date" className="mt-[20px]">폰트 생성 날짜</label>
                            <input type="text" id="font-date" placeholder="99.01.01" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-family" className="mt-[20px]">폰트체</label>
                            <input type="text" id="font-family" placeholder="Nanum Square" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-type" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 형태</div>
                                <div className="inline-block leading-loose text-[12px] dark:text-theme-blue-1 cursor-text">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                            </label>
                            <input type="text" id="font-type" placeholder="Sans Serif" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-weight" className="mt-[20px]">폰트 두께</label>
                            <input type="text" id="font-weight" placeholder="NNNYNNNNN" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-source" className="mt-[20px]">폰트 출처</label>
                            <input type="text" id="font-source" placeholder="네이버" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-source-link" className="mt-[20px]">폰트 출처 링크</label>
                            <input type="text" id="font-source-link" placeholder="https://hangeul.naver.com/font" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-download-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">다운로드 링크</div>
                                <button id="font-download-link-copy" onClick={copyOnClick} value="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input type="text" id="font-download-link" placeholder="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-css" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">CSS 설정하기</div>
                                <button id="font-cdn-css-copy" onClick={copyOnClick} value="font-family: 'Nanum Square';" className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input type="text" id="font-cdn-css" placeholder="font-family: 'Nanum Square';" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">LINK 방식</div>
                                <button id="font-cdn-link-copy" onClick={copyOnClick} value='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input type="text" id="font-cdn-link" placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        );

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null || user.user_no !== 1) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: user,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Index;
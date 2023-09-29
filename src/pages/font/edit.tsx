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

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"로그인 · 폰트 아카이브"}
                description={"로그인 - 상업용 무료 한글 폰트 아카이브"}
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
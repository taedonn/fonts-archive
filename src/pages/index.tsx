// react hooks
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// api
import { CheckIfSessionExists } from "./api/user/checkifsessionexists";
import { FetchUserInfo } from "./api/user/fetchuserinfo";
import { FetchUserLike } from "./api/user/fetchuserlike";

// components
import Header from "@/components/header";
import TooltipIndex from "@/components/tooltipIndex";
import FontBox from "@/components/fontbox";

const Index = ({params}: any) => {
    // 쿠키 훅
    const [, setCookie] = useCookies<string>([]);

    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 옵션 - "허용 범위" 디폴트: "전체"
    const [license, setLicense] = useState<string>(params.license);

    /** 옵션 - "허용 범위" 클릭 */
    const handleLicenseOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1년으로 설정
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        if (e.target.checked) {
            setCookie('license', e.target.value, {path:'/', expires: expires, secure:true, sameSite:'none'});
            setLicense(e.target.value);
        }
    }

    // 옵션 - "언어 선택" 디폴트: "전체"
    const [lang, setLang] = useState<string>(params.lang);

    /** 옵션 - "언어 선택" 클릭 */
    const handleLangOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1년으로 설정
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        if (e.target.checked) {
            setCookie('lang', e.target.value, {path:'/', expires: expires, secure:true, sameSite:'none'});
            setLang(e.target.value);
        }
    }

    // 옵션 - "폰트 형태" 디폴트: 전체
    const [type, setType] = useState<string>(params.type);

    /** 옵션 - "폰트 형태" 클릭 */
    const handleTypeOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1년으로 설정
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        if (e.target.checked) {
            setCookie('type', e.target.value, {path:'/', expires: expires, secure:true, sameSite:'none'});
            setType(e.target.value);
        }
    }

    // 옵션 - "정렬순" 디폴트: 조회순
    const [sort, setSort] = useState<string>(params.sort);

    /** 옵션 - "정렬순" 클릭 */
    const handleSortOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1년으로 설정
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        if (e.target.checked) {
            setCookie('sort', e.target.value, {path:'/', expires: expires, secure:true, sameSite:'none'});
            setSort(e.target.value);
        }
    }

    // 텍스트 입력칸 디폴트: 빈 문자열
    const [text, setText] = useState("");
    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    // 폰트 검색 기능
    const [searchword, setSearchword] = useState(params.source);
    const debouncedSearch = debounce((e) => { setSearchword(e.target.value); }, 500);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }

    // 로딩 시 body 패딩 제거 & 풋터 제거
    useEffect(() => {
        const body = document.body as HTMLBodyElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;
        body.style.paddingBottom = "0";
        footer.style.display = "none";
    }, []);

    return (
        <>
            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"index"}
                license={license}
                lang={lang}
                type={type}
                sort={sort}
                source={params.source}
                handleTextChange={handleTextChange}
                handleLicenseOptionChange={handleLicenseOptionChange}
                handleLangOptionChange={handleLangOptionChange}
                handleTypeOptionChange={handleTypeOptionChange}
                handleSortOptionChange={handleSortOptionChange}
                handleSearch={handleSearch}
            />
            
            {/* 메인 */}
            <FontBox 
                license={license}
                lang={lang}
                type={type}
                sort={sort}
                user={params.user}
                like={params.like}
                filter={params.filter}
                searchword={searchword}
                text={text}
                num={999}
            />

            {/* 고정 메뉴 */}
            <TooltipIndex/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieLicense = ctx.req.cookies.license === undefined ? "all" : ctx.req.cookies.license;
        const cookieLang = ctx.req.cookies.lang === undefined ? "all" : ctx.req.cookies.lang;
        const cookieType = ctx.req.cookies.type === undefined ? "all" : ctx.req.cookies.type;
        const cookieSort = ctx.req.cookies.sort === undefined ? "view" : ctx.req.cookies.sort;
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 검색어 파라미터 체크
        const source = ctx.query.search === undefined ? "" : ctx.query.search;

        // 필터링 파라미터 체크
        const filter = ctx.query.filter === undefined ? '' : ctx.query.filter;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 가져오기
        const session = ctx.req.cookies.session;
        const user = session === undefined
            ? null
            : await FetchUserInfo(session);

        // 유저 정보가 있으면, 좋아요한 폰트 체크
        const like = user === null
            ? null 
            : await FetchUserLike(user.user_no);

        return {
            props: {
                params: {
                    license: cookieLicense,
                    lang: cookieLang,
                    type: cookieType,
                    sort: cookieSort,
                    theme: cookieTheme,
                    source: source,
                    userAgent: userAgent,
                    user: user !== null ? JSON.parse(JSON.stringify(user)) : null,
                    like: like,
                    filter: filter,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Index;
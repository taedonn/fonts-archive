// react hooks
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// api
import { Auth, getAccessToken } from "./api/auth/auth";
import { FetchUserLike } from "./api/user/fetchuserlike";

// components
import Header from "@/components/header";
import TooltipIndex from "@/components/tooltipIndex";
import FontBox from "@/components/fontbox";

// import { useSession } from "next-auth/react";

const Index = ({params}: any) => {
    // 쿠키 훅
    const [, setCookie] = useCookies<string>([]);

    // const session = useSession();
    // console.log(session);

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
            setCookie('license', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
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
            setCookie('lang', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
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
            setCookie('type', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
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
            setCookie('sort', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            setSort(e.target.value);
        }
    }

    // 텍스트 입력칸 디폴트: 빈 문자열
    const [text, setText] = useState("");
    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    // 폰트 검색 기능
    const [searchword, setSearchword] = useState(params.source);
    const debouncedSearch = debounce((e) => {
        if (e.target) setSearchword(e.target.value);
        else setSearchword("");
    }, 500);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }

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
        const license = ctx.req.cookies.license === undefined ? "all" : ctx.req.cookies.license;
        const lang = ctx.req.cookies.lang === undefined ? "all" : ctx.req.cookies.lang;
        const type = ctx.req.cookies.type === undefined ? "all" : ctx.req.cookies.type;
        const sort = ctx.req.cookies.sort === undefined ? "view" : ctx.req.cookies.sort;
        const theme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 파라미터 가져오기
        const source = ctx.query.search === undefined ? "" : ctx.query.search;
        const filter = ctx.query.filter === undefined ? "" : ctx.query.filter;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // refreshToken 불러오기
        const refreshToken = ctx.req.cookies.refreshToken;

        // accessToken으로 유저 정보 가져오기
        const accessToken = refreshToken === undefined
            ? null
            : await getAccessToken(refreshToken);

        // accessToken으로 유저 정보 불러오기
        const user = accessToken === null
            ? null
            : await Auth(accessToken);

        // 유저 정보가 있으면, 좋아요한 폰트 체크
        const like = user === null
            ? null
            : await FetchUserLike(user.user_no);

        return {
            props: {
                params: {
                    license: license,
                    lang: lang,
                    type: type,
                    sort: sort,
                    theme: theme,
                    source: source,
                    filter: filter,
                    userAgent: userAgent,
                    user: user !== null ? JSON.parse(JSON.stringify(user)) : null,
                    like: like,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Index;
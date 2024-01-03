// react hooks
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// api
import { FetchUserLike } from "./api/user/fetchuserlike";

// components
import Header from "@/components/header";
import TooltipIndex from "@/components/tooltipIndex";
import FontBox from "@/components/fontbox";
import KakaoAdFitTopBanner from "@/components/kakaoAdFitTopBanner";

const Index = ({params}: any) => {
    // 쿠키 훅
    const [, setCookie] = useCookies<string>([]);

    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // states
    const { theme, source, filter, user, like } = params;
    const [license, setLicense] = useState<string>(params.license);
    const [lang, setLang] = useState<string>(params.lang);
    const [type, setType] = useState<string>(params.type);
    const [sort, setSort] = useState<string>(params.sort);
    const [text, setText] = useState<string>("");
    const [searchword, setSearchword] = useState<string>(source);

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

    // 텍스트 입력칸
    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    // 폰트 검색 기능
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
                theme={theme}
                user={user}
                page={"index"}
                license={license}
                lang={lang}
                type={type}
                sort={sort}
                source={source}
                handleTextChange={handleTextChange}
                handleLicenseOptionChange={handleLicenseOptionChange}
                handleLangOptionChange={handleLangOptionChange}
                handleTypeOptionChange={handleTypeOptionChange}
                handleSortOptionChange={handleSortOptionChange}
                handleSearch={handleSearch}
            />

            {/* 카카오 애드핏 상단 띠배너 */}
            <div>
                <KakaoAdFitTopBanner
                    marginTop={12}
                />
            </div>
            
            {/* 메인 */}
            <FontBox 
                license={license}
                lang={lang}
                type={type}
                sort={sort}
                user={user}
                like={like}
                filter={filter}
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
        // 쿠키 가져오기
        const { license, lang, type, sort, theme } = ctx.req.cookies;

        // 파라미터 가져오기
        const { source, filter } = ctx.query;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

        // 유저 정보가 있으면, 좋아요한 폰트 체크
        const like = session === null
            ? null
            : await FetchUserLike(session.user);

        return {
            props: {
                params: {
                    license: license ? license : 'all',
                    lang: lang ? lang : 'all',
                    type: type ? type : 'all',
                    sort: sort ? sort : 'date',
                    theme: theme ? theme : 'light',
                    source: source ? source : '',
                    filter: filter ? filter : '',
                    userAgent: userAgent,
                    user: session === null ? null : session.user,
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
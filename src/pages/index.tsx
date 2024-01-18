// react
import { useState } from "react";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// api
import { FetchUserLike } from "./api/user/fetchuserlike";

// libraries
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// components
import Header from "@/components/header";
import Tooltip from "@/components/tooltip";
import Sidemenu from "@/components/sidemenu";
import FontBox from "@/components/fontbox";

const Index = ({params}: any) => {
    const { license, lang, type, sort, theme, source, filter, userAgent, user, like } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    // states
    const [, setCookie] = useCookies<string>([]);
    const [thisLicense, setLicense] = useState<string>(license);
    const [thisLang, setLang] = useState<string>(lang);
    const [thisType, setType] = useState<string>(type);
    const [thisSort, setSort] = useState<string>(sort);
    const [text, setText] = useState<string>("");
    const [searchword, setSearchword] = useState<string>(source);
    const [expand, setExpand] = useState<boolean>(isMobile ? false : true);

    /** 옵션 - "허용 범위" 클릭 */
    const handleLicenseOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);

        if (e.target.checked) {
            setCookie('license', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            setLicense(e.target.value);
        }
    }

    /** 옵션 - "언어 선택" 클릭 */
    const handleLangOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);

        if (e.target.checked) {
            setCookie('lang', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            setLang(e.target.value);
        }
    }

    /** 옵션 - "폰트 형태" 클릭 */
    const handleTypeOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);

        if (e.target.checked) {
            setCookie('type', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            setType(e.target.value);
        }
    }

    /** 옵션 - "정렬순" 클릭 */
    const handleSortOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 쿠키 유효 기간 1달
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);

        if (e.target.checked) {
            setCookie('sort', e.target.value, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            setSort(e.target.value);
        }
    }

    // 텍스트 입력칸
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    /** 폰트 검색 기능 */
    const debouncedSearch = debounce((e) => {
        if (e.target) setSearchword(e.target.value);
        else setSearchword("");
    }, 500);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }

    // 필터 초기화하기
    const resetFilter = () => {
        // 쿠키 유효 기간 삭제
        const expires = new Date();
        expires.setMonth(expires.getMonth() - 1);

        // 상태 리셋
        setLicense("all");
        setLang("all");
        setType("all");
        setSort("date");
        setText("");
        setSearchword("");

        // 쿠키 리셋
        setCookie('license', "all", {path:'/', expires: expires, secure: true, sameSite: 'strict'});
        setCookie('lang', "all", {path:'/', expires: expires, secure: true, sameSite: 'strict'});
        setCookie('type', "all", {path:'/', expires: expires, secure: true, sameSite: 'strict'});
        setCookie('sort', "date", {path:'/', expires: expires, secure: true, sameSite: 'strict'});
    }

    /** 사이드 메뉴 펼치기/접기 */
    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => { setExpand(e.target.checked); }

    return (
        <>
            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
                page={"index"}
                handleSearch={handleSearch}
            />
            
            {/* 메인 */}
            <div className="w-full flex">
                <Sidemenu
                    expand={expand}
                    handleExpand={handleExpand}
                    lang={thisLang}
                    license={thisLicense}
                    type={thisType}
                    sort={thisSort}
                    source={source}
                    text={text}
                    searchword={searchword}
                    handleTextChange={handleTextChange}
                    handleLangOptionChange={handleLangOptionChange}
                    handleLicenseOptionChange={handleLicenseOptionChange}
                    handleTypeOptionChange={handleTypeOptionChange}
                    handleSortOptionChange={handleSortOptionChange}
                    handleSearch={handleSearch}
                    resetFilter={resetFilter}
                />
                <FontBox 
                    expand={expand}
                    license={thisLicense}
                    lang={thisLang}
                    type={thisType}
                    sort={thisSort}
                    user={user}
                    like={like}
                    filter={filter}
                    searchword={searchword}
                    text={text}
                    num={999}
                />
            </div>

            {/* 고정 메뉴 */}
            <Tooltip/>
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
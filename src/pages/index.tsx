// react hooks
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// components
import Header from "@/components/header";
import Tooltip from "@/components/tooltip";
import FontBox from "@/components/fontbox";

const Index = ({params}: any) => {
    // 쿠키 훅
    const [cookies, setCookie] = useCookies<string>([]);

    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 옵션 - "언어 선택" 디폴트: "전체"
    const [lang, setLang] = useState<string>(params.lang);

    /** 옵션 - "언어 선택" 클릭 */
    const handleLangOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setCookie('lang', e.target.value, {path:'/', secure:true, sameSite:'none'});
            setLang(e.target.value);
        }
    }

    // 옵션 - "폰트 형태" 디폴트: 전체
    const [type, setType] = useState<string>(params.type);

    /** 옵션 - "폰트 형태" 클릭 */
    const handleTypeOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setCookie('type', e.target.value, {path:'/', secure:true, sameSite:'none'});
            setType(e.target.value);
        }
    }

    // 옵션 - "정렬순" 디폴트: 조회순
    const [sort, setSort] = useState<string>(params.sort);

    /** 옵션 - "정렬순" 클릭 */
    const handleSortOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setCookie('sort', e.target.value, {path:'/', secure:true, sameSite:'none'});
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

    // 컬러 테마 디폴트: 나잇 모드
    const [theme, setTheme] = useState(params.theme);

    /** 컬러 테마 변경 */
    const handleColorThemeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const themeInput = document.getElementById("color-theme") as HTMLInputElement;

        if (e.target.checked) {
            setCookie('theme', e.target.value, {path:'/', secure:true, sameSite:'none'});
            if (e.target.value === "dark") {
                document.documentElement.classList.add('dark');
                setTheme("dark");
            } else {
                document.documentElement.classList.remove('dark');
                setTheme("light");
            }
        }
        themeInput.checked = false;
    }

    return (
        <>
            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                page={"index"}
                lang={lang}
                type={type}
                sort={sort}
                source={params.source}
                handleTextChange={handleTextChange}
                handleLangOptionChange={handleLangOptionChange}
                handleTypeOptionChange={handleTypeOptionChange}
                handleSortOptionChange={handleSortOptionChange}
                handleSearch={handleSearch}
                handleColorThemeChange={handleColorThemeChange}
            />

            {/* 고정 메뉴 */}
            <Tooltip/>
            
            {/* 메인 */}
            <FontBox 
                lang={lang} 
                type={type} 
                sort={sort} 
                searchword={searchword} 
                text={text} 
                num={999}
            />
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieLang = ctx.req.cookies.lang === undefined ? "all" : ctx.req.cookies.lang;
        const cookieType = ctx.req.cookies.type === undefined ? "all" : ctx.req.cookies.type;
        const cookieSort = ctx.req.cookies.sort === undefined ? "view" : ctx.req.cookies.sort;
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 필터링 파라미터 체크
        const source = ctx.query.search === undefined ? "" : ctx.query.search;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        return {
            props: {
                params: {
                    lang: cookieLang,
                    type: cookieType,
                    sort: cookieSort,
                    theme: cookieTheme,
                    source: source,
                    userAgent: userAgent,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Index;
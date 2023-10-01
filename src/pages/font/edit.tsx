// react hooks
import { useEffect, useRef, useState } from "react";
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

    /** lodash/debounce가 적용된 검색 기능 */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }
    const debouncedSearch = debounce((e) => { setKeyword(e.target.value); }, 500);

    // 검색 키워드가 변경되거나, 검색창이 띄워지면 refetch
    useEffect(() => { refetch(); }, [keyword, focus, refetch]);

    /** 검색바가 포커스 되면 검색창 띄우기 */
    const handleFocus = () => { setFocus(true); }

    // 검색바 ref
    const refSearchBar = useRef<HTMLInputElement>(null);
    const refSearchResult = useRef<HTMLDivElement>(null);

    // 검색바 외 클릭
    useEffect(() => {
        function handleAccountOutside(e:Event) {
            if (refSearchBar?.current && !refSearchBar.current.contains(e.target as Node) && refSearchResult.current && !refSearchResult.current.contains(e.target as Node)) {
                setFocus(false);
            }
        }
        document.addEventListener("mouseup", handleAccountOutside);
        return () => document.removeEventListener("mouseup", handleAccountOutside);
    },[refSearchBar, refSearchResult]);

    /** 검색결과 클릭 */
    const onFontClick = async (e: any) => {
        if (e.target.id) {
            await axios.get(`/api/detailpage/${e.target.id}`)
            .then(res => {
                const font = res.data.fonts;
                const fontCode = document.getElementById("font-code") as HTMLInputElement;
                const fontName = document.getElementById("font-name") as HTMLInputElement;
                const fontLang = document.getElementById("font-lang") as HTMLInputElement;
                const fontDate = document.getElementById("font-date") as HTMLInputElement;
                const fontFamily = document.getElementById("font-family") as HTMLInputElement;
                const fontType = document.getElementById("font-type") as HTMLInputElement;
                const fontWeight = document.getElementById("font-weight") as HTMLInputElement;
                const fontSource = document.getElementById("font-source") as HTMLInputElement;
                const fontSourceLink = document.getElementById("font-source-link") as HTMLInputElement;
                const fontDownloadLink = document.getElementById("font-download-link") as HTMLInputElement;
                const fontCdnCss = document.getElementById("font-cdn-css") as HTMLInputElement;
                const fontCdnLink = document.getElementById("font-cdn-link") as HTMLInputElement;
                const fontCdnImport = document.getElementById("font-cdn-import") as HTMLInputElement;
                const fontCdnFontFace = document.getElementById("font-cdn-font-face") as HTMLTextAreaElement;
                const fontLicense = document.getElementById("font-license") as HTMLInputElement;
                const fontLicenseText = document.getElementById("font-license-text") as HTMLTextAreaElement;

                fontCode.value = font.code;
                fontName.value = font.name;
                fontLang.value = font.lang;
                fontDate.value = font.date;
                fontFamily.value = font.font_family;
                fontType.value = font.font_type;
                fontWeight.value = font.font_weight;
                fontSource.value = font.source;
                fontSourceLink.value = font.source_link;
                fontDownloadLink.value = font.github_link;
                fontCdnCss.value = font.cdn_css;
                fontCdnLink.value = font.cdn_link;
                fontCdnImport.value = font.cdn_import;
                fontCdnFontFace.value = font.cdn_font_face;
                fontLicense.value = font.license_print + font.license_web + font.license_video + font.license_package + font.license_embed + font.license_bici + font.license_ofl + font.license_purpose + font.license_source;
                fontLicenseText.value = font.license;
            })
            .then(() => setFocus(false))
            .catch(err => console.log(err));
        }
    }

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

    const [fontCodeAlert, setFontCodeAlert] = useState<boolean>(false);
    const [fontNameAlert, setFontNameAlert] = useState<boolean>(false);
    const [fontLangAlert, setFontLangAlert] = useState<boolean>(false);
    const [fontDateAlert, setFontDateAlert] = useState<boolean>(false);
    const [fontFamilyAlert, setFontFamilyAlert] = useState<boolean>(false);
    const [fontTypeAlert, setFontTypeAlert] = useState<boolean>(false);
    const [fontWeightAlert, setFontWeightAlert] = useState<boolean>(false);
    const [fontSourceAlert, setFontSourceAlert] = useState<boolean>(false);
    const [fontSourceLinkAlert, setFontSourceLinkAlert] = useState<boolean>(false);
    const [fontDownloadLinkAlert, setFontDownloadLinkAlert] = useState<boolean>(false);
    const [fontCdnCssAlert, setFontCdnCssAlert] = useState<boolean>(false);
    const [fontCdnLinkAlert, setFontCdnLinkAlert] = useState<boolean>(false);
    const [fontCdnImportAlert, setFontCdnImportAlert] = useState<boolean>(false);
    const [fontCdnFontFaceAlert, setFontCdnFontFaceAlert] = useState<boolean>(false);
    const [fontLicenseAlert, setFontLicenseAlert] = useState<boolean>(false);
    const [fontLicenseTextAlert, setFontLicenseTextAlert] = useState<boolean>(false);

    /** 수정하기 버튼 클릭 */
    const editBtnClick = () => {
        const fontCode = document.getElementById("font-code") as HTMLInputElement;
        const fontName = document.getElementById("font-name") as HTMLInputElement;
        const fontLang = document.getElementById("font-lang") as HTMLInputElement;
        const fontDate = document.getElementById("font-date") as HTMLInputElement;
        const fontFamily = document.getElementById("font-family") as HTMLInputElement;
        const fontType = document.getElementById("font-type") as HTMLInputElement;
        const fontWeight = document.getElementById("font-weight") as HTMLInputElement;
        const fontSource = document.getElementById("font-source") as HTMLInputElement;
        const fontSourceLink = document.getElementById("font-source-link") as HTMLInputElement;
        const fontDownloadLink = document.getElementById("font-download-link") as HTMLInputElement;
        const fontCdnCss = document.getElementById("font-cdn-css") as HTMLInputElement;
        const fontCdnLink = document.getElementById("font-cdn-link") as HTMLInputElement;
        const fontCdnImport = document.getElementById("font-cdn-import") as HTMLInputElement;
        const fontCdnFontFace = document.getElementById("font-cdn-font-face") as HTMLTextAreaElement;
        const fontLicense = document.getElementById("font-license") as HTMLInputElement;
        const fontLicenseText = document.getElementById("font-license-text") as HTMLTextAreaElement;

        // 빈 값 체크
        if (fontCode.value === "") {
            setFontCodeAlert(true);
            window.scrollTo({top: fontCode.offsetTop});
        }
    }

    // 수정하기 onChange 이벤트
    const handleFontCodeChange = () => { setFontCodeAlert(false); }

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
                            <input ref={refSearchBar} onChange={handleSearch} onFocus={handleFocus} type='text' id='search-font' tabIndex={1} placeholder='폰트명/회사명을 입력해 주세요...' className={`w-[280px] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            <div ref={refSearchResult} style={focus ? {display: "block"} : {display: "none"}} className="edit-font-search w-[100%] h-[180px] overflow-y-auto absolute bottom-[-6px] translate-y-[100%] rounded-[8px] py-[10px] dark:bg-theme-blue-2">
                                {
                                    data.fonts && isSuccess && !isLoading && !isRefetching
                                    ? data.fonts.length !== 0
                                        ? data.fonts.map((font: any) => {
                                            return (
                                                <div onClick={onFontClick} key={font.code} id={font.code} className="group w-[100%] h-[36px] px-[12px] flex items-center bg-transparent hover:dark:bg-theme-blue-1 text-[12px] cursor-pointer">
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
                            <input onChange={handleFontCodeChange} tabIndex={1} type="text" id="font-code" placeholder="폰트 번호" className={`w-[100%] ${fontCodeAlert ? "border-theme-red focus:border-theme-red" : "border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1"}  text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCodeAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 번호를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-name" className="mt-[20px]">폰트 이름</label>
                            <input tabIndex={2} type="text" id="font-name" placeholder="나눔 스퀘어" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-lang" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 언어</div>
                                <div className="inline-block leading-loose text-[12px] dark:text-theme-blue-1 cursor-text">[KR, EN]</div>
                            </label>
                            <input tabIndex={3} type="text" id="font-lang" placeholder="KR" maxLength={2} className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-date" className="mt-[20px]">폰트 생성 날짜</label>
                            <input tabIndex={4} type="text" id="font-date" placeholder="99.01.01" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-family" className="mt-[20px]">폰트체</label>
                            <input tabIndex={5} type="text" id="font-family" placeholder="Nanum Square" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-type" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 형태</div>
                                <div className="inline-block leading-loose text-[12px] dark:text-theme-blue-1 cursor-text">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                            </label>
                            <input tabIndex={6} type="text" id="font-type" placeholder="Sans Serif" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-weight" className="mt-[20px]">폰트 두께</label>
                            <input tabIndex={7} type="text" id="font-weight" placeholder="NNNYNNNNN" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-source" className="mt-[20px]">폰트 출처</label>
                            <input tabIndex={8} type="text" id="font-source" placeholder="네이버" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-source-link" className="mt-[20px]">폰트 출처 링크</label>
                            <input tabIndex={9} type="text" id="font-source-link" placeholder="https://hangeul.naver.com/font" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-download-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">다운로드 링크</div>
                                <button id="font-download-link-copy" onClick={copyOnClick} value="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input tabIndex={10} type="text" id="font-download-link" placeholder="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-css" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">CSS 설정하기</div>
                                <button id="font-cdn-css-copy" onClick={copyOnClick} value="font-family: 'Nanum Square';" className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input tabIndex={11} type="text" id="font-cdn-css" placeholder="font-family: 'Nanum Square';" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">Link 방식</div>
                                <button id="font-cdn-link-copy" onClick={copyOnClick} value='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input tabIndex={12} type="text" id="font-cdn-link" placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-import" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">Import 방식</div>
                                <button id="font-cdn-import-copy" onClick={copyOnClick} value="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input tabIndex={13} type="text" id="font-cdn-import" placeholder="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-cdn-font-face" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">font-face 방식</div>
                                <button 
                                    id="font-cdn-font-face-copy" 
                                    onClick={copyOnClick} 
                                    value={
`@font-face {
    font-family: 'Nanum Square';
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff2') format('woff2'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff') format('woff'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.otf') format('opentype'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.ttf') format('truetype');
}`} 
                                    className="inline-flex items-center leading-loose text-[12px] dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <textarea 
                                id="font-cdn-font-face" 
                                tabIndex={14}
                                placeholder={
`@font-face {
    font-family: 'Nanum Square';
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff2') format('woff2'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff') format('woff'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.otf') format('opentype'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.ttf') format('truetype');
}`} 
                                className="font-edit-textarea w-[100%] h-[196px] resize-none border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2">
                            </textarea>
                            <label htmlFor="font-license" className="mt-[20px]">라이센스 사용 범위</label>
                            <input tabIndex={15} type="text" id="font-license" placeholder="HHHHHHNNN" className="w-[100%] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2"/>
                            <label htmlFor="font-license-text" className="mt-[20px]">라이센스 본문</label>
                            <textarea 
                                id="font-license-text" 
                                tabIndex={16}
                                placeholder={
`네이버 나눔글꼴의 지적 재산권은 네이버와 네이버문화재단에 있습니다.
네이버 나눔글꼴은 개인 및 기업 사용자를 포함한 모든 사용자에게 무료로 제공되며 자유롭게 수정하고 재배포하실 수 있습니다.
단, 글꼴 자체를 유료로 판매하는 것은 금지하며 네이버 나눔글꼴은 본 저작권 안내와 라이선스 전문을 포함해서 다른 소프트웨어와 번들하거나 재배포 또는 판매가 가능합니다.
네이버 나눔글꼴 라이선스 전문을 포함하기 어려울 경우, 나눔글꼴의 출처 표기를 권장합니다.
예) 이 페이지에는 네이버에서 제공한 나눔글꼴이 적용되어 있습니다.
네이버 나눔글꼴을 사용한 인쇄물, 광고물(온라인 포함)의 이미지는 나눔글꼴 프로모션을 위해 활용될 수 있습니다.
이를 원치 않는 사용자는 언제든지 당사에 요청하실 수 있습니다.
<a href="https://help.naver.com/support/contents/contents.nhn?serviceNo=1074&categoryNo=3497" target="_blank">라이선스 전문보기</a>`} 
                                className="font-edit-textarea w-[100%] h-[196px] resize-none border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2">
                            </textarea>
                        </div>
                        <button onClick={editBtnClick} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[12px] dark:text-theme-3 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">수정하기</button>
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
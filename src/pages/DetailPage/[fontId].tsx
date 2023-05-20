// 훅
import { useEffect, useState } from "react";
import { isMacOs } from "react-device-detect";
import { NextSeo } from 'next-seo';
import { FetchFont } from "../api/DetailPage/fetchFont";
import { FetchFontInfo } from "../api/DetailPage/fetchFontInfo";
import axios from "axios";

// 컴포넌트
import Tooltip from "@/components/tooltip";
import FontSearch from "@/components/fontsearch";
import DummyText from "@/components/dummytext";

const alphabetKR = '가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';
const alphabetEN = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';

function DetailPage({fontInfo, randomNum}:{fontInfo: any, randomNum: number}) {
    /** 폰트 데이터 props */
    const font = fontInfo[0];

    /** 조회수 업데이트 */
    const viewUpdate = async () => {
        await fetch("/api/updateview", { method: "POST", body: JSON.stringify(font) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { viewUpdate(); }, [font]);

    /** 조회수 불러오기 */
    const defaultView = null;
    const [view, setView] = useState<number | null>(defaultView);
    const viewFetch = async () => {
        const res = await axios.get("/api/fetchview", { params: { code: font.code } }).then(res => { return res.data; }).catch(error => console.log(error));
        setView(res.fonts[0].view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { viewFetch(); }, [view]);

    /** 조회수 단위 변경 : 1000 => 1K */
    const ranges = [
        { divider: 1e6 , suffix: 'M' },
        { divider: 1e3 , suffix: 'k' }
    ];
    const formatNumber = (n: number | null) => {
        if (n === null) {
            return ""
        }
        else {
            for (let i = 0; i < ranges.length; i++) {
                if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
            }
        }
        return n.toString();
    }

    /** 폰트 검색 훅 */
    const defaultSearchDisplay = "hide"
    const [searchDisplay, setSearchDisplay] = useState(defaultSearchDisplay);
    useEffect(() => { setSearchDisplay(defaultSearchDisplay); }, [defaultSearchDisplay])

    /** 폰트 검색 버튼 클릭 */
    const handleFontSearch = () => {
        setSearchDisplay("show");
        document.body.style.overflow = "hidden";
    }

    /** 폰트 검색 ESC 버튼 클릭 */
    const handleFontSearchCloseBtn = () => {
        setSearchDisplay("hide");
        document.body.style.overflow = "auto";
    }

    /** 키값 변경 */
    const [isMac, setIsMac] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (isMacOs) { setIsMac(true) }
        else { setIsMac(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMacOs]);

    /** 웹 폰트 적용하기 훅 */
    const defaultWebFont = "CSS";
    const [webFont, setWebFont] = useState(defaultWebFont);
    useEffect(() => {
        setWebFont(defaultWebFont);
    },[defaultWebFont]);

    /** 웹 폰트 클릭 시 코드 변경 */
    const handleWebFont = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "CSS") { setWebFont("CSS"); }
        else if (e.target.value === "link") { setWebFont("link"); }
        else if (e.target.value === "import") { setWebFont("import"); }
        else { setWebFont("font-face"); }
    }

    useEffect(() => {
        const cdnFontFace = document.getElementById("cdn-font-face") as HTMLDivElement;
        if (webFont === "font-face") { cdnFontFace.innerHTML = font.cdn_font_face; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webFont]);

    /** 웹 폰트 적용하기 복사 버튼 클릭 이벤트 */
    const copyOnClick = () => {
        const pre = document.getElementsByClassName("cdn_pre")[0] as HTMLPreElement;
        const copyBtn = document.getElementsByClassName("copy_btn")[0] as SVGSVGElement;
        const copyChkBtn = document.getElementsByClassName("copy_chk_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(pre.innerText);

        copyBtn.style.display = 'none';
        copyChkBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'block';
            copyChkBtn.style.display = 'none';
        },1000);
    }

    /** 폰트 두께 텍스트 체인지 이벤트 */
    const defaultText = "";
    const [text, setText] = useState(defaultText);
    useEffect(() => {
        setText(defaultText);
    }, [defaultText])
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    /** 라이센스 본문 */
    useEffect(() => {
        const license = document.getElementById("license") as HTMLDivElement;
        license.innerHTML = font.license;
    }, [font.license]);

    return (
        <>
            {/* Head 부분*/}
            <NextSeo title={font.name + " · FONTS ARCHIVE"}/>

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 헤더 */}
            <div className='interface w-[100%] h-[60px] tlg:h-[56px] px-[20px] tlg:px-[16px] tmd:px-[12px] fixed right-0 top-0 z-10 flex flex-row justify-between items-center backdrop-blur bg-blur-theme border-b border-dark-theme-4'>
                <div className="flex flex-row justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <svg className="w-[18px] tlg:w-[16px] pb-px fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </a>
                </div>
                <div className="w-content flex flex-row justify-start items-center">
                    <button onClick={handleFontSearch} className="w-[220px] tlg:w-[200px] tmd:w-[32px] h-[32px] relative text-[14px] tlg:text-[12px] text-normal text-dark-theme-8 leading-none bg-dark-theme-3/80 flex flex-start justify-start items-center rounded-[8px] tmd:rounded-[6px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <span className="tmd:hidden">폰트 검색하기...</span>
                        <svg className="w-[12px] tlg:w-[10px] absolute left-[16px] tlg:left-[11px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                        <div className="absolute right-[16px] flex flex-row justify-center items-center">
                            {
                                isMac === true
                                ? <div className="flex flex-row justify-center items-center">
                                    <svg className="tmd:hidden w-[10px] fill-dark-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                    <span className="tmd:hidden text-[12px] leading-none pt-px">K</span>
                                </div>
                                : ( isMac === false
                                    ? <span className="tmd:hidden text-[12px] tlg:text-[10px] leading-none">Ctrl + K</span>
                                    : <></>
                                )
                            }
                        </div>
                    </button>
                </div>
            </div>

            {/* 메인 */}
            <div className="w-[100%] mt-[60px] tlg:mt-[56px] p-[20px] tlg:p-[16px] tmd:p-[12px] py-[24px] tlg:py-[20px] tmd:py-[16px]">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-[100%] flex flex-col justify-start items-start">
                    <div style={{fontFamily:font.font_family}} className="text-[32px] tlg:text-[28px] tmd:text-[24px] text-dark-theme-8 font-medium leading-tight mb-[12px] tlg:mb-[8px]">{font.name}</div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-dark-theme-8 ml-[2px] mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">제작<span className="text-dark-theme-6 ml-[8px] tlg:ml-[6px]">{font.source}</span></div>
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-dark-theme-8  mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">형태<span className="text-dark-theme-6 ml-[8px] tlg:ml-[6px]">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : "장식체"))}</span></div>
                        <div style={{fontFamily:font.font_family}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-dark-theme-8 ">조회수<span className="text-dark-theme-6 ml-[8px] tlg:ml-[6px]">{formatNumber(view)}</span></div>
                    </div>
                    <div className="w-[100%] h-px my-[20px] tlg:my-[16px] bg-dark-theme-4"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <a href={font.source_link} target="_blank" className="h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-blue-theme-border font-medium border-2 tmd:border border-blue-theme-border rounded-full px-[20px] mr-[12px] tmd:mr-[8px] cursor-pointer hover:bg-blue-theme-border/10">다운로드 페이지로 이동</a>
                    {
                        font.license_ofl[0] === "N"
                        ? <></>
                        : <a href={font.github_link} target="_blank" className="w-[180px] tlg:w-[140px] tmd:w-[128px] h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8 font-medium border-2 tmd:border border-dark-theme-8 rounded-full px-[20px] cursor-pointer hover:bg-dark-theme-8/10">폰트 다운로드</a>
                    }
                </div>
                {
                    font.license_embed === "N" || font.license_ofl[0] === "N"
                    ? <></>
                    : <>
                        <div className="flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                            <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-dark-theme-8 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">웹 폰트 사용하기</h2>
                            <div className="cdn w-[1000px] tlg:w-[100%] h-[60px] tlg:h-[48px] tmd:h-[40px] overflow-hidden border-x border-t border-b border-dark-theme-4 rounded-t-[8px] flex flex-row justify-start items-center">
                                <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                                <label htmlFor="cdn_css" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-dark-theme-8 leading-none cursor-pointer">CSS 설정하기</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                                <label htmlFor="cdn_link" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-dark-theme-8 leading-none cursor-pointer">link 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                                <label htmlFor="cdn_import" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-dark-theme-8 leading-none cursor-pointer">import 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                                <label htmlFor="cdn_font_face" className="w-[25%] h-[100%] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-dark-theme-8 leading-none cursor-pointer">font-face 방식</label>
                            </div>
                            <div className="w-[1000px] tlg:w-[100%] border-x border-b rounded-b-[8px] border-dark-theme-4 bg-dark-theme-3">
                                {
                                    webFont === "CSS"
                                    ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8">{font.cdn_css}</pre></div>
                                        <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                    : ( webFont === "link"
                                        ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                            <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8">{font.cdn_link}</pre></div>
                                            <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                            </div>
                                        </div>
                                        : ( webFont === "import"
                                            ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8">{font.cdn_import}</pre></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                            : <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[auto] py-[24px] tlg:py-[20px] tmd:py-[15px] flex flex-row justify-start items-center overflow-auto whitespace-nowrap"><div id="cdn-font-face" style={{fontFamily:"Noto Sans KR"}} className="font-face text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8">{font.cdn_font_face}</div></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[36px] tlg:top-[30px] tmd:top-[24px] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
                <div className="font-weight-wrap flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-dark-theme-8 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">폰트 두께</h2>
                    <input onChange={handleFontWeightChange} type="text" placeholder="Type something..." className="w-[100%] h-[50px] tmd:h-[auto] text-[14px] text-dark-theme-8 leading-none px-[24px] tlg:px-[20px] tmd:py-[12px] pb-px mb-[32px] tlg:mb-[20px] border border-dark-theme-4 rounded-full bg-transparent"/>
                    {
                        font.font_weight[0] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Thin 100</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"100"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[1] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">ExtraLight 200</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"200"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[2] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Light 300</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"300"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[3] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Regular 400</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"400"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[4] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Medium 500</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"500"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[5] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">SemiBold 600</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"600"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[6] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Bold 700</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"700"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[7] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Heavy 800</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"800"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[8] === "Y"
                        ? <>
                            <div className="text-[14px] tmd:text-[12px] text-dark-theme-8 leading-none mb-[16px] tlg:mb-[14px]">Black 900</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"900"}} className="font-weight w-[100%] text-[20px] tlg:text-[16px] text-dark-theme-8 pb-[16px] tlg:pb-[14px] mb-[32px] tlg:mb-[20px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                </div>
                <div className="flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-dark-theme-8 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">폰트 크기</h2>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">10px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[10px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">12px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[12px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">14px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[14px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">16px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[16px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">18px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[18px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">20px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[20px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">28px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[28px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">32px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[32px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">36px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[36px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">40px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[40px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">48px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[48px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center mb-[24px]">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">56px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[56px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center">
                        <div className="text-[14px] tmd:text-[12px] text-dark-theme-6 leading-tight pr-[16px]">64px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[64px] text-dark-theme-8 leading-tight">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start">
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-dark-theme-8 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">라이센스 사용 범위</h2>
                    <table className="w-[100%] mb-[20px] tlg:mb-[16px]">
                        <thead className="h-[60px] tlg:h-[48px] bg-dark-theme-3 border-x border-dark-theme-3">
                            <tr className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8 font-medium">
                                <th className="w-[240px] tlg:w-[120px] tmd:w-[88px] border-r border-dark-theme-4">카테고리</th>
                                <th>사용 범위</th>
                                <th className="w-[240px] tlg:w-[120px] tmd:w-[88px] border-l border-dark-theme-4">허용 여부</th>
                            </tr>
                        </thead>
                        <tbody className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-dark-theme-8 text-center font-normal border-x border-b border-dark-theme-4">
                            <tr className="tlg:relative">
                                <td rowSpan={5} className="border-r border-dark-theme-4">인쇄</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-dark-theme-4">브로슈어, 카탈로그, DM, 전단지, 포스터, 패키지, 캘린더 등 인쇄물</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center">
                                    {
                                        font.license_print[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_print[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_print[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_print[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">책, 만화책, 잡지, 정기간행물, 신문 등 출판물</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_print[1] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_print[1] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_print[1] === "R"
                                                ? <>권장</>
                                                : ( font.license_print[1] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">간판, 현수막, 판넬 등 제작물</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_print[2] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_print[2] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_print[2] === "R"
                                                ? <>권장</>
                                                : ( font.license_print[2] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">신문광고, 잡지광고, 차량광고 등 광고물</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_print[3] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_print[3] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_print[3] === "R"
                                                ? <>권장</>
                                                : ( font.license_print[3] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">인쇄 및 문서 공유를 위한 PDF 파일 제작</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_print[4] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_print[4] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_print[4] === "R"
                                                ? <>권장</>
                                                : ( font.license_print[4] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td rowSpan={2} className="border-r border-t border-dark-theme-4">웹사이트</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">웹페이지, 광고 배너, 메일, E-브로슈어 등</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_web[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_web[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_web[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_web[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">웹서버용 폰트</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_web[1] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_web[1] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_web[1] === "R"
                                                ? <>권장</>
                                                : ( font.license_web[1] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td rowSpan={5} className="border-r border-t border-dark-theme-4">영상</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">방송 및 영상물 자막</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_video[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_video[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_video[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_video[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">TV-CF, 온라인 영상광고</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_video[1] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_video[1] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_video[1] === "R"
                                                ? <>권장</>
                                                : ( font.license_video[1] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">영화(DVD / 비디오), 오프닝, 엔딩크레딧 자막</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_video[2] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_video[2] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_video[2] === "R"
                                                ? <>권장</>
                                                : ( font.license_video[2] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">개인 UCC 및 홍보물</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_video[3] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_video[3] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_video[3] === "R"
                                                ? <>권장</>
                                                : ( font.license_video[3] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">E-Learning 콘텐츠, 온라인 동영상강좌, 플래시 강좌</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_video[4] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_video[4] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_video[4] === "R"
                                                ? <>권장</>
                                                : ( font.license_video[4] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="border-r border-t border-dark-theme-4">포장지</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">판매용 상품의 패키지</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_package[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_package[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_package[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_package[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="border-r border-t border-dark-theme-4">임베딩</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_embed[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_embed[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_embed[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_embed[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="border-r border-t border-dark-theme-4">BI/CI</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_bici[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_bici[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_bici[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_bici[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td rowSpan={2} className="border-r border-t border-dark-theme-4">OFL</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">폰트 파일의 수정, 편집 및 재배포</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_ofl[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_ofl[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_ofl[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_ofl[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">폰트 파일의 유료 판매</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_ofl[1] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_ofl[1] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_ofl[1] === "R"
                                                ? <>권장</>
                                                : ( font.license_ofl[1] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td rowSpan={2} className="border-r border-t border-dark-theme-4">용도</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">개인적 용도 사용</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_purpose[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_purpose[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_purpose[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_purpose[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">상업적 용도 사용</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_purpose[1] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_purpose[1] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_purpose[1] === "R"
                                                ? <>권장</>
                                                : ( font.license_purpose[1] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                            <tr className="tlg:relative">
                                <td className="border-r border-t border-dark-theme-4">출처</td>
                                <td className="h-[60px] tlg:h-[auto] tlg:p-[16px] tmd:p-[12px] border-r border-t border-dark-theme-4">출처 표시</td>
                                <td className="h-[60px] tlg:h-[100%] tlg:w-[120px] tmd:w-[88px] tlg:absolute flex flex-row justify-center items-center border-t border-dark-theme-4">
                                    {
                                        font.license_source[0] === "Y"
                                        ? <svg className="w-[16px] tlg:w-[14px] tmd:w-[12px] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                        : ( font.license_source[0] === "N"
                                            ? <div style={{color:"#C30010"}}>금지</div>
                                            : ( font.license_source[0] === "R"
                                                ? <>권장</>
                                                : ( font.license_source[0] === "Q"
                                                    ? <div style={{color:"#C30010"}}>문의</div>
                                                    : <></>
                                                )
                                            )
                                        )
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="w-[100%] border border-dark-theme-4 px-[28px] tlg:px-[24px] tmd:px-[20px] py-[32px] tlg:py-[28px] tmd:py-[24px]">
                        <h2 className="text-[24px] tlg:text-[20px] tmd:text-[16px] text-dark-theme-8 font-medium leading-none">라이센스 본문</h2>
                        <div className="w-[100%] h-px bg-dark-theme-4 my-[20px] tmd:my-[16px]"></div>
                        <div style={{fontFamily:"Noto Sans KR"}} id="license" className="whitespace-pre-wrap text-[16px] tlg:text-[14px] tmd:text-[12px] text-dark-theme-8 leading-loose"></div>
                    </div>
                </div>
            </div>
            
            {/* 폰트 검색 */}
            <FontSearch display={searchDisplay} closeBtn={handleFontSearchCloseBtn} showBtn={handleFontSearch}/>
        </>
    )
}

export async function getStaticPaths() {
    try {
        const fonts = await FetchFont();

        const paths = fonts.map((font: any) => ({
            params: { fontId: font.code.toString() },
        }));

        return { paths, fallback: false }
    } catch (error) {
        console.log(error);
    }
}

export async function getStaticProps(ctx: any) {
    try {
        const fonts = await FetchFontInfo(ctx.params.fontId);

        const randomNum: number = Math.floor(Math.random() * 19);

        return {
            props: {
                fontInfo: fonts,
                randomNum: randomNum,
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;